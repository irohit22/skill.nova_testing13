// Native Web Speech API Integration for Voice Assistant
export class VoiceAssistant {
  private recognition: any = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private speechSynth: SpeechSynthesis | null = null;
  private voiceEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      }

      if ('speechSynthesis' in window) {
        this.speechSynth = window.speechSynthesis;
      }

      const stored = localStorage.getItem('skillnova_voice_tts_enabled');
      if (stored !== null) {
        this.voiceEnabled = stored === 'true';
      }
    }
  }

  public isSpeechSupported(): boolean {
    return !!this.recognition;
  }

  public isTTSSupported(): boolean {
    return !!this.speechSynth;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    localStorage.setItem('skillnova_voice_tts_enabled', String(enabled));
    if (!enabled && this.speechSynth) {
      this.speechSynth.cancel();
      this.isSpeaking = false;
    }
  }

  public isTTSEnabled(): boolean {
    return this.voiceEnabled;
  }

  public startListening(
    onResult: (text: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError(new Error('Speech recognition not supported in this browser.'));
      return;
    }

    if (this.isSpeaking && this.speechSynth) {
      this.speechSynth.cancel();
      this.isSpeaking = false;
    }

    try {
      this.recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        this.isListening = false;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.isListening = true;
      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      onError(e);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.speechSynth || !this.voiceEnabled) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.speechSynth.cancel(); // Stop any active speech

      // Clean markdown tags for natural speech
      const cleanText = text
        .replace(/```[\s\S]*?```/g, 'Code snippet provided in notes.')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/#+\s+/g, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/>\s*/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim();

      // Limit length of spoken text to first 2-3 sentences for natural conversational delivery
      const sentences = cleanText.split(/(?<=[.!?])\s+/);
      const spokenExcerpt = sentences.slice(0, 4).join(' ');

      const utterance = new SpeechSynthesisUtterance(spokenExcerpt);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select preferred voice if available
      const voices = this.speechSynth.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      this.speechSynth.speak(utterance);
    } catch (e) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.speechSynth) {
      this.speechSynth.cancel();
      this.isSpeaking = false;
    }
  }
}

export const voiceAssistant = new VoiceAssistant();
