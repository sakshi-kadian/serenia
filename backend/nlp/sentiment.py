"""
Emotion Detection Module using BERT
Fine-tuned on GoEmotions dataset for 28 emotion labels
"""

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from typing import Dict, List, Tuple
import numpy as np

class EmotionDetector:
    """
    Emotion detection using pre-trained BERT model fine-tuned on GoEmotions
    
    GoEmotions: 28 emotion labels including:
    - admiration, amusement, anger, annoyance, approval, caring, confusion, 
      curiosity, desire, disappointment, disapproval, disgust, embarrassment,
      excitement, fear, gratitude, grief, joy, love, nervousness, optimism,
      pride, realization, relief, remorse, sadness, surprise, neutral
    """
    
    def __init__(self, model_name: str = "SamLowe/roberta-base-go_emotions"):
        """
        Initialize the emotion detector
        
        Args:
            model_name: Hugging Face model name (default: pre-trained GoEmotions model)
        """
        print(f"Loading emotion detection model: {model_name}")
        
        # Load tokenizer and model
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        
        # Set device (GPU if available, else CPU)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        self.model.eval()
        
        # GoEmotions emotion labels
        self.emotion_labels = [
            "admiration", "amusement", "anger", "annoyance", "approval",
            "caring", "confusion", "curiosity", "desire", "disappointment",
            "disapproval", "disgust", "embarrassment", "excitement", "fear",
            "gratitude", "grief", "joy", "love", "nervousness",
            "optimism", "pride", "realization", "relief", "remorse",
            "sadness", "surprise", "neutral"
        ]
        
        print(f"✅ Emotion detector loaded on {self.device}")
    
    def detect_emotion(self, text: str, top_k: int = 3) -> Dict:
        """
        Detect emotions in the given text
        
        Args:
            text: Input text to analyze
            top_k: Number of top emotions to return (default: 3)
        
        Returns:
            Dictionary containing:
            - primary_emotion: Most likely emotion
            - confidence: Confidence score (0-1)
            - top_emotions: List of top-k emotions with scores
            - all_scores: All 28 emotion scores
        """
        # Tokenize input
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True
        ).to(self.device)
        
        # Get predictions
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            
            # Apply sigmoid for multi-label classification
            probabilities = torch.sigmoid(logits).cpu().numpy()[0]
        
        # Get top-k emotions
        top_indices = np.argsort(probabilities)[-top_k:][::-1]
        top_emotions = [
            {
                "emotion": self.emotion_labels[idx],
                "score": float(probabilities[idx])
            }
            for idx in top_indices
        ]
        
        # Primary emotion
        primary_idx = np.argmax(probabilities)
        primary_emotion = self.emotion_labels[primary_idx]
        confidence = float(probabilities[primary_idx])
        
        # All emotion scores
        all_scores = {
            label: float(score)
            for label, score in zip(self.emotion_labels, probabilities)
        }
        
        return {
            "primary_emotion": primary_emotion,
            "confidence": confidence,
            "top_emotions": top_emotions,
            "all_scores": all_scores
        }
    
    def detect_emotions_batch(self, texts: List[str], top_k: int = 3) -> List[Dict]:
        """
        Detect emotions for multiple texts
        
        Args:
            texts: List of input texts
            top_k: Number of top emotions per text
        
        Returns:
            List of emotion detection results
        """
        return [self.detect_emotion(text, top_k) for text in texts]
    
    def get_emotion_category(self, emotion: str) -> str:
        """
        Categorize emotion into broader categories
        
        Args:
            emotion: Emotion label
        
        Returns:
            Category: positive, negative, neutral, or ambiguous
        """
        positive_emotions = {
            "admiration", "amusement", "approval", "caring", "excitement",
            "gratitude", "joy", "love", "optimism", "pride", "relief"
        }
        
        negative_emotions = {
            "anger", "annoyance", "disappointment", "disapproval", "disgust",
            "embarrassment", "fear", "grief", "nervousness", "remorse", "sadness"
        }
        
        neutral_emotions = {"neutral"}
        
        ambiguous_emotions = {
            "confusion", "curiosity", "desire", "realization", "surprise"
        }
        
        if emotion in positive_emotions:
            return "positive"
        elif emotion in negative_emotions:
            return "negative"
        elif emotion in neutral_emotions:
            return "neutral"
        else:
            return "ambiguous"


# Singleton instance
_emotion_detector = None

def get_emotion_detector() -> EmotionDetector:
    """Get or create emotion detector singleton"""
    global _emotion_detector
    if _emotion_detector is None:
        _emotion_detector = EmotionDetector()
    return _emotion_detector


# Example usage
if __name__ == "__main__":
    # Test the emotion detector
    detector = EmotionDetector()
    
    test_texts = [
        "I'm so happy and excited about this new opportunity!",
        "I feel really sad and disappointed about what happened.",
        "This is making me so angry and frustrated!",
        "I'm grateful for all the support you've given me.",
        "I'm feeling anxious and nervous about tomorrow."
    ]
    
    print("\n" + "="*60)
    print("EMOTION DETECTION TEST")
    print("="*60 + "\n")
    
    for text in test_texts:
        result = detector.detect_emotion(text)
        print(f"Text: {text}")
        print(f"Primary Emotion: {result['primary_emotion']} ({result['confidence']:.2%})")
        print(f"Top 3 Emotions:")
        for emotion in result['top_emotions']:
            print(f"  - {emotion['emotion']}: {emotion['score']:.2%}")
        print(f"Category: {detector.get_emotion_category(result['primary_emotion'])}")
        print("-" * 60 + "\n")
