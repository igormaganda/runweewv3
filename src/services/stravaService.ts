import axios from 'axios';

const STRAVA_API_URL = 'https://www.strava.com/api/v3';

export interface StravaActivity {
  id: number;
  name: string;
  description?: string;
  type: string;
  start_date: string;
  elapsed_time: number;
  distance: number;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  total_elevation_gain?: number;
  moving_time?: number;
  location_city?: string;
  location_country?: string;
  map?: {
    summary_polyline?: string;
    snapshot_url?: string;
  };
  suffer_score?: number;
}

export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: {
    id: number;
    username?: string;
    firstname?: string;
    lastname?: string;
    profile_medium?: string;
  };
}

export class StravaService {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.STRAVA_CLIENT_ID || '';
    this.clientSecret = process.env.STRAVA_CLIENT_SECRET || '';
  }

  /**
   * Génère l'URL d'autorisation Strava OAuth
   */
  getAuthUrl(state: string, redirectUri: string): string {
    return `https://www.strava.com/oauth/authorize?` +
      `client_id=${this.clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=read,activity:read_all&` +
      `state=${state}`;
  }

  /**
   * Échange le code d'autorisation contre des tokens
   */
  async exchangeToken(code: string, redirectUri: string): Promise<StravaTokens> {
    const response = await axios.post(`${STRAVA_API_URL}/oauth/token`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });
    return response.data;
  }

  /**
   * Rafraîchit un token d'accès expiré
   */
  async refreshToken(refreshToken: string): Promise<StravaTokens> {
    const response = await axios.post(`${STRAVA_API_URL}/oauth/token`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });
    return response.data;
  }

  /**
   * Récupère les activités d'un athlète
   */
  async getActivities(accessToken: string, page: number = 1, perPage: number = 30): Promise<StravaActivity[]> {
    const response = await axios.get(`${STRAVA_API_URL}/athlete/activities`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  /**
   * Récupère une activité spécifique avec tous les détails
   */
  async getActivity(accessToken: string, activityId: string): Promise<StravaActivity> {
    const response = await axios.get(`${STRAVA_API_URL}/activities/${activityId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
  }

  /**
   * Map une activité Strava vers le format de la base de données
   */
  mapStravaActivityToDB(stravaActivity: StravaActivity, userId: number) {
    return {
      user_id: userId,
      provider: 'strava',
      provider_activity_id: stravaActivity.id.toString(),
      name: stravaActivity.name,
      description: stravaActivity.description,
      type: stravaActivity.type,
      start_date: stravaActivity.start_date,
      elapsed_time: stravaActivity.elapsed_time,
      distance: stravaActivity.distance,
      average_speed: stravaActivity.average_speed,
      max_speed: stravaActivity.max_speed,
      average_heartrate: stravaActivity.average_heartrate,
      max_heartrate: stravaActivity.max_heartrate,
      total_elevation_gain: stravaActivity.total_elevation_gain,
      moving_time: stravaActivity.moving_time,
      location_city: stravaActivity.location_city,
      summary_polyline: stravaActivity.map?.summary_polyline,
      map_snapshot_url: stravaActivity.map?.snapshot_url,
      has_heartrate: !!stravaActivity.average_heartrate,
      training_stress_score: stravaActivity.suffer_score
    };
  }

  /**
   * Calcule le pace (min/km) depuis elapsed_time et distance
   */
  calculatePace(elapsedTime: number, distance: number): string {
    if (!distance || distance <= 0) return '0:00';
    
    const paceSecondsPerKm = elapsedTime / (distance / 1000);
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
   * Détermine la catégorie RunWeek depuis le type Strava
   */
  mapTypeToCategory(stravaType: string): string {
    const typeMap: Record<string, string> = {
      'Run': 'Course',
      'TrailRun': 'Trail',
      'Walk': 'Randonnée',
      'VirtualRun': 'Course',
      'Hike': 'Randonnée'
    };
    return typeMap[stravaType] || 'Course';
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

export const stravaService = new StravaService();
