"""Similitud de hablante (ECAPA-TDNN, speechbrain): coseno entre 0 y 1; misma persona suele dar > 0,75."""
import sys, numpy as np, soundfile as sf, librosa, torch
from speechbrain.inference.speaker import EncoderClassifier
enc = EncoderClassifier.from_hparams(source="speechbrain/spkrec-ecapa-voxceleb", savedir="/home/user/tools/qwen3-tts/ecapa")
def emb(f):
    x, sr = sf.read(f); x = x.mean(1) if x.ndim > 1 else x
    x = librosa.resample(x.astype(np.float32), orig_sr=sr, target_sr=16000)
    return enc.encode_batch(torch.tensor(x)[None]).squeeze()
def sim(a, b): return float(torch.nn.functional.cosine_similarity(emb(a), emb(b), dim=0))
if __name__ == "__main__":
    r = emb(sys.argv[1])
    for f in sys.argv[2:]:
        print(f"{float(torch.nn.functional.cosine_similarity(r, emb(f), dim=0)):.3f}  {f}")
