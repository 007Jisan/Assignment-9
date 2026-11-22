export interface GoogleUserProfile {
  email: string;
  name: string;
  picture: string;
  sub?: string;
}

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '342908256851-na2mjpneth4uor18542rqbrkr92ja2te.apps.googleusercontent.com';

/**
 * Triggers official Google OAuth 2.0 popup and retrieves verified Google profile details
 */
export const signInWithGoogle = (): Promise<GoogleUserProfile> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Google Authentication is only supported in the browser.'));
    }

    if (!GOOGLE_CLIENT_ID) {
      return reject(new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.'));
    }

    const startOAuth = () => {
      try {
        const google = (window as any).google;
        if (!google?.accounts?.oauth2) {
          return reject(
            new Error('Google Identity Services SDK could not be initialized. Please refresh.')
          );
        }

        const client = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              if (tokenResponse.error === 'popup_closed_by_user') {
                return reject(new Error('Sign in was canceled.'));
              }
              return reject(new Error(tokenResponse.error_description || tokenResponse.error));
            }

            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              });

              if (!res.ok) {
                return reject(new Error('Failed to retrieve user profile from Google.'));
              }

              const data = await res.json();
              if (!data.email) {
                return reject(new Error('Google did not return a valid email address.'));
              }

              resolve({
                email: data.email,
                name: data.name || data.given_name || 'Google User',
                picture: data.picture || '',
                sub: data.sub,
              });
            } catch (err: any) {
              reject(new Error(err.message || 'Failed fetching Google user info.'));
            }
          },
        });

        // Request access token - opens the official Google Sign-In popup
        client.requestAccessToken();
      } catch (err: any) {
        reject(err);
      }
    };

    const google = (window as any).google;
    if (google?.accounts?.oauth2) {
      startOAuth();
    } else {
      // If script tag is still loading, wait up to 4s or inject script
      let retries = 0;
      const interval = setInterval(() => {
        retries++;
        if ((window as any).google?.accounts?.oauth2) {
          clearInterval(interval);
          startOAuth();
        } else if (retries > 20) {
          clearInterval(interval);
          // Try dynamic append
          const existing = document.getElementById('google-gsi-script');
          if (!existing) {
            const script = document.createElement('script');
            script.id = 'google-gsi-script';
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.onload = () => startOAuth();
            script.onerror = () => reject(new Error('Failed to load Google SDK.'));
            document.head.appendChild(script);
          } else {
            reject(new Error('Google Sign-In SDK took too long to load. Please try again.'));
          }
        }
      }, 200);
    }
  });
};
