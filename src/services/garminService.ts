import axios from 'axios';

const GARMIN_OAUTH_URL = 'https://connect.garmin.com/oauthConfirm';
const GARMIN_TOKEN_URL = 'https://connectapi.garmin.com/oauth-service/oauth/access_token';
const GARMIN_API_URL = 'https://apis.garmin.com/wellness-api/rest';

export interface GarminActivity {
  activityId: string;
  activityName: string;
  activityType: { key: string };
  startTimeLocal: string;
  startTimeGMT: string;
  duration: number;
  distance: number;
  averageSpeed: number;
  maxSpeed: number;
  averageHR: number;
  maxHR: number;
  calories: number;
  elevationGain: number;
  elevationLoss: number;
  sampleCount: number;
}

export interface GarminTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id?: string;
}

export class GarminService {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.GARMIN_CLIENT_ID || '';
    this.clientSecret = process.env.GARMIN_CLIENT_SECRET || '';
  }

  /**
   * Génère l'URL d'autorisation Garmin OAuth
   */
  getAuthUrl(state: string, redirectUri: string): string {
    return `${GARMIN_OAUTH_URL}?&` +
      `client_id=${this.clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `state=${state}`;
  }

  /**
   * Échange le code d'autorisation contre des tokens
   */
  async exchangeToken(code: string, redirectUri: string): Promise<GarminTokens> {
    const params = new URLSearchParams();
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', redirectUri);

    const response = await axios.post(GARMIN_TOKEN_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + response.data.expires_in,
      user_id: response.data.user_id,
    };
  }

  /**
   * Rafraîchit un token d'accès expiré
   */
  async refreshToken(refreshToken: string): Promise<GarminTokens> {
    const params = new URLSearchParams();
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('refresh_token', refreshToken);
    params.append('grant_type', 'refresh_token');

    const response = await axios.post(GARMIN_TOKEN_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + response.data.expires_in,
    };
  }

  /**
   * Récupère les activités d'un utilisateur Garmin
   */
  async getActivities(
    accessToken: string,
    startDate?: string,
    endDate?: string
  ): Promise<GarminActivity[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await axios.get(`${GARMIN_API_URL}/activities`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    });

    return response.data;
  }

  /**
   * Récupère une activité spécifique avec tous les détails
   */
  async getActivity(accessToken: string, activityId: string): Promise<GarminActivity> {
    const response = await axios.get(`${GARMIN_API_URL}/activities/${activityId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  /**
   * Map une activité Garmin vers le format de la base de données
   */
  mapGarminActivityToDB(garminActivity: GarminActivity, userId: number) {
    return {
      user_id: userId,
      provider: 'garmin',
      provider_activity_id: garminActivity.activityId.toString(),
      name: garminActivity.activityName,
      description: null,
      type: garminActivity.activityType?.key || 'running',
      start_date: garminActivity.startTimeLocal,
      elapsed_time: garminActivity.duration,
      distance: garminActivity.distance,
      average_speed: garminActivity.averageSpeed,
      max_speed: garminActivity.maxSpeed,
      average_heartrate: garminActivity.averageHR,
      max_heartrate: garminActivity.maxHR,
      total_elevation_gain: garminActivity.elevationGain,
      moving_time: garminActivity.duration,
      location_city: null,
      summary_polyline: null,
      map_snapshot_url: null,
      has_heartrate: !!garminActivity.averageHR,
      training_stress_score: null,
    };
  }

  /**
   * Calcule le pace (min/km) depuis duration et distance
   */
  calculatePace(duration: number, distance: number): string {
    if (!distance || distance <= 0) return '0:00';

    const paceSecondsPerKm = duration / (distance / 1000);
    const paceMinutes = Math.floor(paceSecondsPerKm / 60);
    const paceSeconds = Math.floor(paceSecondsPerKm % 60);
    return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Formate le temps en HH:MM:SS
   */
  formatTime(elapsedSeconds: number): string {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Détermine la catégorie RunWeek depuis le type Garmin
   */
  mapTypeToCategory(garminType: string): string {
    const typeMap: Record<string, string> = {
      'running': 'Course',
      'trail_running': 'Trail',
      'walking': 'Randonnée',
      'cycling': 'Cyclisme',
    };
    return typeMap[garminType] || 'Course';
  }

  /**
   * Génère un slug unique depuis le nom de l'activité
   */
  generateSlug(name: string, activityId: string): string {
    const slugBase = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${slugBase}-${activityId}`;
  }
}

export const garminService = new GarminService();
