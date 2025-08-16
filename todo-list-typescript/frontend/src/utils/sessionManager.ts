// Session management utility for todo app
export class SessionManager {
  private static readonly SESSION_KEY = 'todo_session_id';

  // Generate a new session ID
  private static generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get or create session ID
  static getSessionId(): string {
    let sessionId = localStorage.getItem(this.SESSION_KEY);
    
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem(this.SESSION_KEY, sessionId);
      console.log('🆔 New session created:', sessionId);
    } else {
      console.log('🆔 Using existing session:', sessionId);
    }
    
    return sessionId;
  }

  // Clear session (for testing purposes)
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    console.log('🗑️ Session cleared');
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
