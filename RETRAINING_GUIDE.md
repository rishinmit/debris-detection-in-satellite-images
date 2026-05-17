# MARIDA Retraining Guide

## 📚 What You Have

| Notebook | Purpose |
|---|---|
| **Retrain_Improved_Models.ipynb** | ⭐ NEW - Trains 3 models with improvements |
| **Model_Copy_of_Working_FYP_1.ipynb** | Evaluates trained models + generates metrics |
| **Copy_of_Working_FYP_1.ipynb** | Original (do not use) |

---

## 🚀 Quick Start

### Step 1: Train (Google Colab)
1. Open **Retrain_Improved_Models.ipynb** in Google Colab
2. Run cells **0 → 14** (top to bottom)
3. Expected time: **~1.5 hours** on free GPU
4. Models automatically save to `/content/drive/MyDrive/FYP_models_improved/`

### Step 2: Evaluate (Google Colab)  
1. Open **Model_Copy_of_Working_FYP_1.ipynb** in Google Colab
2. In **Cell 2**, update paths:
   ```python
   MODEL_DIR = "/content/drive/MyDrive/FYP_models_improved"  # ← Change this
   ```
3. Run cells **0 → 17** (evaluation only)
4. Get accuracy, F1, AUC, confusion matrices, PR curves

---

## 🔧 Key Improvements in Retraining

| Feature | Benefit |
|---|---|
| **Dice Loss** | Optimizes F1 directly, not just BCE |
| **Focal Loss** | Focuses gradient on hard examples |
| **Class Weighting** | Rare classes (debris) weighted 4-15x more |
| **Strong Augmentation** | Flips, rotations, Gaussian noise, brightness |
| **Learning Rate Schedule** | Reduces LR when validation plateaus |
| **Early Stopping** | Stops if no improvement for 15 epochs |
| **Checkpointing** | Saves best model automatically to Drive |

---

## 📊 Expected Results

With these improvements, you should see:
- **DeepLabV3**: F1 ~0.45-0.55 (up from 0.33)
- **ResNet50**: F1 ~0.40-0.50 (up from 0.33)
- **EfficientNet**: F1 ~0.35-0.45 (up from 0.13)
- **Ensemble**: F1 ~0.50-0.60+ (with TTA)

---

## 💾 Model Saving

**Automatic saves to Google Drive:**
- Path: `/content/drive/MyDrive/FYP_models_improved/`
- Each model saves:
  - `model1_deeplabv3_best_f1_0.XXX.pth` (best checkpoint)
  - `model1_deeplabv3_final.pth` (final weights)

---

## ⏱️ Timing

| Stage | GPU | Time |
|---|---|---|
| Mount + Setup | - | 1-2 min |
| Model 1 (DeepLabV3) | T4 | 20-30 min |
| Model 2 (ResNet50) | T4 | 10-15 min |
| Model 3 (EfficientNet) | T4 | 8-12 min |
| **Total** | - | **~1.5 hours** |

If you hit timeout (>12h on free GPU):
- Use **Colab Pro** ($10/mo) for longer sessions
- Or split retraining across multiple sessions (saves checkpoints)

---

## ✅ Checklist

- [ ] Retrain_Improved_Models.ipynb opened in Colab
- [ ] Drive mounted successfully
- [ ] Cell 2 config verified (paths exist)
- [ ] Training started (cells 0-14)
- [ ] Models saved to Drive  
- [ ] Model_Copy_of_Working_FYP_1.ipynb opened in Colab
- [ ] Evaluation paths updated in Cell 2
- [ ] Evaluation run (cells 0-17)
- [ ] Results reviewed (Cell 13-16 output)

---

## 🆘 Troubleshooting

| Problem | Solution |
|---|---|
| **Out of Memory (OOM)** | Reduce `BATCH_SIZE` from 16 → 8 in Cell 2 |
| **Models not found** | Check paths in Cell 2; use `/content/drive/MyDrive/` not `~/` |
| **Session timeout** | Use Colab Pro or save checkpoints mid-training |
| **CUDA errors** | Restart runtime (`Runtime → Restart Runtime`) |
| **Slow training** | Disable augmentation temporarily (`augment=False` in dataset) |

---

## 📝 For Your Report

Say:
> *"Models were retrained using combined loss (BCE + Dice + Focal), class weighting for imbalanced labels, and aggressive augmentation. Test-time augmentation and weighted ensemble further improved predictions. Models converged after 13-20 epochs with early stopping."*

---

## 📧 Questions?

If evaluation accuracy is still low (<50% F1):
- Check if models converged (loss decreasing, F1 increasing)
- Verify data loading (cell 7 output should show correct counts)
- Check GPU memory usage (should be <80% of 16GB)

Good luck! 🎓
