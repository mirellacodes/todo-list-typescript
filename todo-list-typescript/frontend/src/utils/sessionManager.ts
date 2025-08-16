// Session management utility for todo app
export class SessionManager {
  private static readonly SESSION_KEY = 'todo_session_id';

  // Generate a new session ID
  private static generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const sessionId = `session_${timestamp}_${random}`;
    console.log('🔧 Generating new session ID:', sessionId);
    return sessionId;
  }

  // Get or create session ID
  static getSessionId(): string {
    console.log('🔍 Checking localStorage for existing session...');
    let sessionId = localStorage.getItem(this.SESSION_KEY);
    
    if (!sessionId) {
      console.log('🆕 No existing session found, creating new one...');
      sessionId = this.generateSessionId();
      localStorage.setItem(this.SESSION_KEY, sessionId);
      console.log('✅ New session created and stored:', sessionId);
    } else {
      console.log('🔄 Using existing session from localStorage:', sessionId);
    }
    
    return sessionId;
  }

  // Clear session (for testing purposes)
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY + '_initialized');
    console.log('🗑️ Session cleared completely');
  }

  // Force new session (for testing)
  static forceNewSession(): string {
    console.log('🔄 Forcing new session...');
    this.clearSession();
    return this.getSessionId();
  }

  // Get session info
  static getSessionInfo(): { sessionId: string; isNew: boolean } {
    const sessionId = this.getSessionId();
    const isNew = !localStorage.getItem(this.SESSION_KEY + '_initialized');
    
    if (isNew) {
      localStorage.setItem(this.SESSION_KEY + '_initialized', 'true');
    }
    
    return { sessionId, isNew };
  }
}
