"""
Anxiety Classification Module
Detects anxiety levels and patterns in user messages
Based on clinical interview patterns from DAIC-WOZ dataset
"""

import re
from typing import Dict, List, Tuple
import numpy as np
from transformers import pipeline

class AnxietyClassifier:
    """
    Anxiety detection and severity classification
    
    Severity Levels:
    - None: 0.0 - 0.3
    - Mild: 0.3 - 0.5
    - Moderate: 0.5 - 0.7
    - Severe: 0.7 - 1.0
    """
    
    def __init__(self):
        """Initialize the anxiety classifier"""
        print("Loading anxiety classification model...")
        
        # Use zero-shot classification for anxiety detection
        self.classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli"
        )
        
        # Anxiety-related labels
        self.anxiety_labels = [
            "anxiety",
            "worry",
            "nervousness",
            "fear",
            "stress",
            "panic",
            "overwhelm"
        ]
        
        # Anxiety linguistic markers (from DAIC-WOZ research)
        self.anxiety_markers = {
            # Cognitive markers
            "cognitive": [
                r"\b(can't stop thinking|racing thoughts|mind won't stop)\b",
                r"\b(worried|worrying|worry)\b",
                r"\b(overthinking|can't focus|distracted)\b",
                r"\b(what if|worst case)\b"
            ],
            # Physical symptoms
            "physical": [
                r"\b(heart racing|pounding|palpitations)\b",
                r"\b(sweating|shaking|trembling)\b",
                r"\b(shortness of breath|can't breathe)\b",
                r"\b(dizzy|lightheaded|nauseous)\b",
                r"\b(tense|tight chest|stomach)\b"
            ],
            # Behavioral markers
            "behavioral": [
                r"\b(avoiding|can't face|putting off)\b",
                r"\b(restless|can't sit still|pacing)\b",
                r"\b(can't sleep|insomnia|nightmares)\b"
            ],
            # Emotional markers
            "emotional": [
                r"\b(anxious|nervous|on edge)\b",
                r"\b(scared|afraid|fearful|terrified)\b",
                r"\b(overwhelmed|stressed out)\b",
                r"\b(panic|panicking|freaking out)\b"
            ]
        }
        
        # Severity indicators
        self.severity_keywords = {
            "severe": [
                "can't function", "unbearable", "constant", "always",
                "every day", "all the time", "can't cope", "breaking down"
            ],
            "moderate": [
                "often", "frequently", "most days", "hard to",
                "difficult", "struggling", "interfering"
            ],
            "mild": [
                "sometimes", "occasionally", "a little", "bit",
                "slightly", "minor", "manageable"
            ]
        }
        
        print("✅ Anxiety classifier loaded")
    
    def detect_anxiety(self, text: str) -> Dict:
        """
        Detect anxiety in the given text
        
        Args:
            text: Input text to analyze
        
        Returns:
            Dictionary containing:
            - anxiety_detected: Boolean
            - severity: none/mild/moderate/severe
            - confidence: Confidence score (0-1)
            - markers_found: List of detected anxiety markers
            - category_scores: Scores for each anxiety category
        """
        text_lower = text.lower()
        
        # 1. Check for linguistic markers
        markers_found = []
        category_scores = {
            "cognitive": 0,
            "physical": 0,
            "behavioral": 0,
            "emotional": 0
        }
        
        for category, patterns in self.anxiety_markers.items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    markers_found.append(pattern.replace(r"\b", "").replace("(", "").replace(")", ""))
                    category_scores[category] += 1
        
        # 2. Use zero-shot classification
        result = self.classifier(
            text,
            candidate_labels=self.anxiety_labels,
            multi_label=True
        )
        
        # Get anxiety-related scores
        anxiety_score = 0
        for label, score in zip(result['labels'], result['scores']):
            if label in ['anxiety', 'worry', 'nervousness', 'fear', 'panic']:
                anxiety_score = max(anxiety_score, score)
        
        # 3. Combine marker-based and ML-based scores
        marker_score = min(sum(category_scores.values()) / 10, 1.0)  # Normalize
        combined_score = (anxiety_score * 0.6) + (marker_score * 0.4)
        
        # 4. Determine severity
        severity = self._calculate_severity(text_lower, combined_score)
        
        # 5. Anxiety detected if score > 0.3 or markers found
        anxiety_detected = combined_score > 0.3 or len(markers_found) > 0
        
        return {
            "anxiety_detected": anxiety_detected,
            "severity": severity,
            "confidence": float(combined_score),
            "markers_found": markers_found[:5],  # Top 5 markers
            "category_scores": category_scores,
            "ml_score": float(anxiety_score),
            "marker_score": float(marker_score)
        }
    
    def _calculate_severity(self, text: str, base_score: float) -> str:
        """
        Calculate anxiety severity based on keywords and base score
        
        Args:
            text: Lowercase text
            base_score: Base anxiety score (0-1)
        
        Returns:
            Severity level: none/mild/moderate/severe
        """
        # Check for severity keywords
        severe_count = sum(1 for kw in self.severity_keywords["severe"] if kw in text)
        moderate_count = sum(1 for kw in self.severity_keywords["moderate"] if kw in text)
        mild_count = sum(1 for kw in self.severity_keywords["mild"] if kw in text)
        
        # Adjust score based on keywords
        if severe_count > 0:
            base_score = min(base_score + 0.2, 1.0)
        elif moderate_count > 0:
            base_score = min(base_score + 0.1, 1.0)
        elif mild_count > 0:
            base_score = max(base_score - 0.1, 0.0)
        
        # Determine severity level
        if base_score >= 0.7:
            return "severe"
        elif base_score >= 0.5:
            return "moderate"
        elif base_score >= 0.3:
            return "mild"
        else:
            return "none"
    
    def get_anxiety_triggers(self, texts: List[str]) -> Dict:
        """
        Analyze multiple texts to identify anxiety triggers
        
        Args:
            texts: List of user messages
        
        Returns:
            Dictionary with trigger analysis
        """
        triggers = {
            "work": 0,
            "social": 0,
            "health": 0,
            "family": 0,
            "financial": 0,
            "general": 0
        }
        
        trigger_keywords = {
            "work": ["work", "job", "boss", "deadline", "project", "meeting", "presentation"],
            "social": ["people", "social", "friends", "party", "crowd", "public speaking"],
            "health": ["health", "sick", "pain", "doctor", "medical", "symptoms"],
            "family": ["family", "parents", "relationship", "partner", "kids"],
            "financial": ["money", "bills", "debt", "financial", "afford", "expensive"]
        }
        
        for text in texts:
            text_lower = text.lower()
            found_trigger = False
            
            for trigger_type, keywords in trigger_keywords.items():
                if any(kw in text_lower for kw in keywords):
                    triggers[trigger_type] += 1
                    found_trigger = True
            
            if not found_trigger:
                triggers["general"] += 1
        
        return triggers
    
    def get_recommendations(self, severity: str) -> List[str]:
        """
        Get recommendations based on anxiety severity
        
        Args:
            severity: Anxiety severity level
        
        Returns:
            List of recommendations
        """
        recommendations = {
            "severe": [
                "Consider speaking with a mental health professional",
                "Practice deep breathing exercises (4-7-8 technique)",
                "Reach out to a trusted friend or family member",
                "Try grounding techniques (5-4-3-2-1 method)",
                "Consider crisis support if feeling overwhelmed"
            ],
            "moderate": [
                "Practice daily mindfulness or meditation",
                "Maintain a regular sleep schedule",
                "Engage in regular physical exercise",
                "Limit caffeine and alcohol intake",
                "Keep a worry journal to track patterns"
            ],
            "mild": [
                "Take short breaks throughout the day",
                "Practice progressive muscle relaxation",
                "Spend time in nature or outdoors",
                "Connect with supportive people",
                "Engage in activities you enjoy"
            ],
            "none": [
                "Continue your current self-care practices",
                "Maintain healthy lifestyle habits",
                "Stay connected with loved ones"
            ]
        }
        
        return recommendations.get(severity, recommendations["none"])


# Singleton instance
_anxiety_classifier = None

def get_anxiety_classifier() -> AnxietyClassifier:
    """Get or create anxiety classifier singleton"""
    global _anxiety_classifier
    if _anxiety_classifier is None:
        _anxiety_classifier = AnxietyClassifier()
    return _anxiety_classifier


# Example usage
if __name__ == "__main__":
    classifier = AnxietyClassifier()
    
    test_texts = [
        "I'm feeling really anxious about my presentation tomorrow. My heart is racing and I can't stop worrying about it.",
        "I feel a bit nervous about the meeting, but I think I'll be okay.",
        "I'm constantly worried about everything. I can't sleep, my mind won't stop racing, and I feel overwhelmed all the time.",
        "Had a great day today! Feeling calm and relaxed.",
        "I'm scared to go to social events. I avoid them because I get so anxious around people."
    ]
    
    print("\n" + "="*70)
    print("ANXIETY CLASSIFICATION TEST")
    print("="*70 + "\n")
    
    for text in test_texts:
        result = classifier.detect_anxiety(text)
        print(f"Text: {text}")
        print(f"Anxiety Detected: {result['anxiety_detected']}")
        print(f"Severity: {result['severity'].upper()} ({result['confidence']:.1%})")
        print(f"Markers Found: {', '.join(result['markers_found']) if result['markers_found'] else 'None'}")
        print(f"Category Scores: {result['category_scores']}")
        
        if result['anxiety_detected']:
            recommendations = classifier.get_recommendations(result['severity'])
            print(f"Recommendations:")
            for rec in recommendations[:2]:
                print(f"  - {rec}")
        
        print("-" * 70 + "\n")
