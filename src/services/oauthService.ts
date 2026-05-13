import crypto from 'crypto';

// Note: Le pool est importé directement dans server.ts
// Cette fonction sera utilisée avec le pool passé en paramètre

export function generateState(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function validateState(state: string, storedState: string): boolean {
  return state === storedState;
}

export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  athlete?: any;
}

export interface UserConnection {
  id: number;
  user_id: number;
  provider: string;
  provider_user_id: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: Date;
  is_active: boolean;
  last_synced_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export class OAuthService {
  /**
   * Sauvegarde une connexion OAuth dans la base de données
   */
  async saveConnection(pool: any, userId: number, provider: string, tokens: OAuthTokens, providerUserId: string) {
    const expiresAt = tokens.expires_at ? new Date(tokens.expires_at * 1000) : null;

    await pool.query(
      `INSERT INTO user_connections (user_id, provider, provider_user_id, access_token, refresh_token, token_expires_at, scope)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, provider) DO UPDATE SET
         access_token = EXCLUDED.access_token,
         refresh_token = EXCLUDED.refresh_token,
         token_expires_at = EXCLUDED.token_expires_at,
         is_active = true,
         updated_at = NOW()`,
      [userId, provider, providerUserId, tokens.access_token, tokens.refresh_token, expiresAt, 'read,activity:read_all']
    );
  }

  /**
   * Récupère une connexion OAuth active pour un utilisateur
   */
  async getConnection(pool: any, userId: number, provider: string): Promise<UserConnection | null> {
    const result = await pool.query(
      'SELECT * FROM user_connections WHERE user_id = $1 AND provider = $2 AND is_active = true',
      [userId, provider]
    );
    return result.rows[0] || null;
  }

  /**
   * Récupère une connexion par provider_user_id (pour le callback OAuth)
   */
  async getConnectionByProviderUserId(pool: any, providerUserId: string, provider: string): Promise<UserConnection | null> {
    const result = await pool.query(
      'SELECT * FROM user_connections WHERE provider_user_id = $1 AND provider = $2 AND is_active = true',
      [providerUserId, provider]
    );
    return result.rows[0] || null;
  }

  /**
   * Met à jour la date de dernière synchronisation
   */
  async updateLastSynced(pool: any, connectionId: number) {
    await pool.query(
      'UPDATE user_connections SET last_synced_at = NOW() WHERE id = $1',
      [connectionId]
    );
  }

  /**
   * Désactive une connexion OAuth
   */
  async deactivateConnection(pool: any, userId: number, provider: string) {
    await pool.query(
      'UPDATE user_connections SET is_active = false WHERE user_id = $1 AND provider = $2',
      [userId, provider]
    );
  }

  /**
   * Met à jour les tokens OAuth (après refresh)
   */
  async updateTokens(pool: any, connectionId: number, tokens: OAuthTokens) {
    const expiresAt = tokens.expires_at ? new Date(tokens.expires_at * 1000) : null;

    await pool.query(
      `UPDATE user_connections 
       SET access_token = $1,
           refresh_token = $2,
           token_expires_at = $3,
           updated_at = NOW()
       WHERE id = $4`,
      [tokens.access_token, tokens.refresh_token, expiresAt, connectionId]
    );
  }
}

export const oauthService = new OAuthService();
