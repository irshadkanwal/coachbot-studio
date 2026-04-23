/**
 * Centralized configuration for Twilio-related settings
 * Handles environment variables, validation, and provides typed access to configuration
 */

interface TwilioCacheConfig {
  tags: string[];
  revalidate: number;
}

class TwilioConfig {
  private encryptionKey: string | undefined;
  private isInitialized = false;

  /**
   * Initialize and validate Twilio configuration
   * This is called lazily on first access to ensure environment variables are available
   */
  private initialize(): void {
    if (this.isInitialized) return;

    this.encryptionKey = process.env.TWILIO_ENCRYPTION_KEY;
    this.isInitialized = true;

    // Validate required configuration
    this.validateConfig();
  }

  /**
   * Validates that all required Twilio configuration is present
   * @throws Error if required configuration is missing
   */
  private validateConfig(): void {
    if (!this.encryptionKey) {
      throw new Error(
        'TWILIO_ENCRYPTION_KEY environment variable is required for Twilio credentials encryption. ' +
          'Please set this variable in your environment configuration.'
      );
    }
  }

  /**
   * Get the encryption key for Twilio credentials
   * @returns The encryption key
   * @throws Error if encryption key is not configured
   */
  getEncryptionKey(): string {
    this.initialize();
    if (!this.encryptionKey) {
      throw new Error('Twilio encryption key is not configured');
    }
    return this.encryptionKey;
  }

  /**
   * Get cache configuration for Twilio credentials
   * @returns Cache configuration for use with unstable_cache
   */
  getCacheConfig(): TwilioCacheConfig {
    return {
      tags: ['twilioCredentials'],
      revalidate: 3600, // 1 hour cache
    };
  }

  /**
   * Check if Twilio configuration is properly set up
   * @returns true if all required configuration is present
   */
  isConfigured(): boolean {
    try {
      this.initialize();
      return !!this.encryptionKey;
    } catch {
      return false;
    }
  }

  /**
   * Get a formatted error message for missing configuration
   * @returns User-friendly error message
   */
  getMissingConfigError(): string {
    return 'Twilio service is not properly configured. Please contact system administrator.';
  }
}

// Export singleton instance
export const twilioConfig = new TwilioConfig();
