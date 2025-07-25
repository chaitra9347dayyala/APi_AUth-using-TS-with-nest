import { ActivityInterceptor } from './session-activity.interceptor'; // Confirm path is correct
import { SessionService } from '../auth/session.service'; // Adjust path if needed

describe('ActivityInterceptor', () => {
  it('should be defined', () => {
    // Mock SessionService
    const mockSessionService = {
      updateToken: jest.fn(),
    } as unknown as SessionService;

    const interceptor = new ActivityInterceptor(mockSessionService);
    expect(interceptor).toBeDefined();
  });
});
