export interface RuntimeParticipant {
  id: number;
  name: string;
  displayName: string;
  role: string;
  email: string;
  layout: string;
  microphoneEnabled: boolean;
  microphoneLevel: number;
  videoEnabled: boolean;
  videoSnapshot: boolean;
}
