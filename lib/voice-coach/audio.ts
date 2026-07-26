/**
 * Client-side audio analysis helpers. All heavy work here operates on
 * already-decoded buffers or is driven by requestAnimationFrame from the
 * caller - nothing here blocks the main thread with a busy loop.
 */

export interface LiveAnalyser {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  source: MediaStreamAudioSourceNode;
  dataArray: Float32Array<ArrayBuffer>;
}

export function createLiveAnalyser(stream: MediaStream): LiveAnalyser {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.6;
  source.connect(analyser);
  const dataArray = new Float32Array(analyser.fftSize) as Float32Array<ArrayBuffer>;
  return { audioContext, analyser, source, dataArray };
}

/** Root-mean-square amplitude in [0, 1] for the current analyser frame. */
export function getRmsAmplitude(live: LiveAnalyser): number {
  live.analyser.getFloatTimeDomainData(live.dataArray);
  let sumSquares = 0;
  for (let i = 0; i < live.dataArray.length; i++) {
    sumSquares += live.dataArray[i] * live.dataArray[i];
  }
  return Math.sqrt(sumSquares / live.dataArray.length);
}

export async function decodeAudioBlob(
  blob: Blob
): Promise<AudioBuffer | null> {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioContext = new AudioContext();
    const buffer = await audioContext.decodeAudioData(arrayBuffer);
    await audioContext.close();
    return buffer;
  } catch {
    return null;
  }
}

interface WindowedRms {
  rms: number;
  startSec: number;
}

/** RMS energy per fixed-size window across the whole buffer. */
export function computeRmsWindows(
  buffer: AudioBuffer,
  windowSec = 0.05
): WindowedRms[] {
  const channel = buffer.getChannelData(0);
  const windowSize = Math.max(1, Math.floor(windowSec * buffer.sampleRate));
  const windows: WindowedRms[] = [];
  for (let start = 0; start < channel.length; start += windowSize) {
    const end = Math.min(start + windowSize, channel.length);
    let sumSquares = 0;
    for (let i = start; i < end; i++) {
      sumSquares += channel[i] * channel[i];
    }
    const rms = Math.sqrt(sumSquares / (end - start));
    windows.push({ rms, startSec: start / buffer.sampleRate });
  }
  return windows;
}

/**
 * Autocorrelation-based pitch estimate (Hz) for a single window of samples.
 * Returns null if the window is unvoiced/too quiet to yield a confident estimate.
 */
export function estimatePitchAutocorrelation(
  samples: Float32Array,
  sampleRate: number
): number | null {
  const size = samples.length;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += samples[i] * samples[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return null;

  const minLag = Math.floor(sampleRate / 400);
  const maxLag = Math.floor(sampleRate / 70);
  let bestLag = -1;
  let bestCorrelation = 0;

  for (let lag = minLag; lag <= maxLag; lag++) {
    let correlation = 0;
    for (let i = 0; i < size - lag; i++) {
      correlation += samples[i] * samples[i + lag];
    }
    correlation /= size - lag;
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }

  if (bestLag <= 0 || bestCorrelation < rms * rms * 0.3) return null;
  return sampleRate / bestLag;
}

/** Pitch estimate (Hz) per voiced window across the whole buffer. */
export function computePitchTrack(
  buffer: AudioBuffer,
  windowSec = 0.05
): number[] {
  const channel = buffer.getChannelData(0);
  const windowSize = Math.max(1, Math.floor(windowSec * buffer.sampleRate));
  const pitches: number[] = [];
  for (let start = 0; start < channel.length; start += windowSize) {
    const end = Math.min(start + windowSize, channel.length);
    const slice = channel.subarray(start, end);
    const pitch = estimatePitchAutocorrelation(slice, buffer.sampleRate);
    if (pitch !== null) pitches.push(pitch);
  }
  return pitches;
}

export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function stddev(values: number[]): number | null {
  if (values.length < 2) return null;
  const avg = mean(values)!;
  const variance =
    values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}
