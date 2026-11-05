export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'misincol_jwt_super_secret_key_2026',
  expiresIn: 604800, // 7 días en segundos
};
