"""
Crisis Detection Module
Detects self-harm, suicidal ideation, and extreme distress
Multi-tier severity scoring with immediate intervention triggers
"""

import re
from typing import Dict, List, Tuple
from config import CRISIS_RESOURCES, CRISIS_KEYWORDS

class CrisisDetector:
    """
    Crisis detection for self-harm and suicidal ideation
    
    Severity Levels:
    - None: No crisis indicators
    - Low: Passive thoughts, no immediate danger
    - Medium: Active thoughts, planning
    - High: Immediate danger, intent to harm
    """
    
    def __init__(self):
        """Initialize the crisis detector"""
        print("Initializing crisis detection system...")
        
        # High-severity keywords (immediate danger)
        self.high_severity_keywords = [
            r"\b(kill myself|end my life|take my life)\b",
            r"\b(suicide|suicidal)\b",
            r"\b(want to die|wish I was dead|better off dead)\b",
            r"\b(going to hurt myself|going to kill myself)\b",
            r"\b(have a plan|made a plan)\b",
            r"\b(goodbye|final goodbye|last time)\b",
            r"\b(no reason to live|nothing to live for)\b",
            r"\b(can't go on|can't take it anymore)\b"
        ]
        
        # Medium-severity keywords (active ideation)
        self.medium_severity_keywords = [
            r"\b(thinking about suicide|thoughts of suicide)\b",
            r"\b(self-harm|hurt myself|cut myself)\b",
            r"\b(end it all|give up)\b",
            r"\b(everyone would be better off|burden to everyone)\b",
            r"\b(hopeless|no hope|pointless)\b",
            r"\b(worthless|useless|failure)\b",
            r"\b(can't do this|too much to handle)\b"
        ]
        
        # Low-severity keywords (passive thoughts)
        self.low_severity_keywords = [
            r"\b(don't want to be here|wish I wasn't here)\b",
            r"\b(tired of living|exhausted)\b",
            r"\b(what's the point|why bother)\b",
            r"\b(giving up|lost hope)\b",
            r"\b(dark thoughts|intrusive thoughts)\b"
        ]
        
        # Protective factors (reduce severity)
        self.protective_factors = [
            r"\b(but I won't|but I wouldn't|just thoughts)\b",
            r"\b(not going to|won't actually)\b",
            r"\b(seeking help|need help|want help)\b",
            r"\b(therapy|therapist|counselor)\b",
            r"\b(family|friends|loved ones)\b",
            r"\b(reasons to live|things to live for)\b"
        ]
        
        print("✅ Crisis detection system initialized")
    
    def detect_crisis(self, text: str) -> Dict:
        """
        Detect crisis indicators in text
        
        Args:
            text: Input text to analyze
        
        Returns:
            Dictionary containing:
            - crisis_detected: Boolean
            - severity: none/low/medium/high
            - confidence: Confidence score (0-1)
            - keywords_found: List of matched keywords
            - immediate_intervention: Boolean (requires immediate action)
            - resources: Crisis resources
        """
        text_lower = text.lower()
        
        # Initialize scores
        high_score = 0
        medium_score = 0
        low_score = 0
        protective_score = 0
        
        keywords_found = []
        
        # Check high-severity keywords
        for pattern in self.high_severity_keywords:
            if re.search(pattern, text_lower):
                high_score += 1
                match = re.search(pattern, text_lower)
                if match:
                    keywords_found.append(match.group())
        
        # Check medium-severity keywords
        for pattern in self.medium_severity_keywords:
            if re.search(pattern, text_lower):
                medium_score += 1
                match = re.search(pattern, text_lower)
                if match:
                    keywords_found.append(match.group())
        
        # Check low-severity keywords
        for pattern in self.low_severity_keywords:
            if re.search(pattern, text_lower):
                low_score += 1
                match = re.search(pattern, text_lower)
                if match:
                    keywords_found.append(match.group())
        
        # Check protective factors
        for pattern in self.protective_factors:
            if re.search(pattern, text_lower):
                protective_score += 1
        
        # Calculate severity
        severity, confidence = self._calculate_severity(
            high_score, medium_score, low_score, protective_score
        )
        
        # Crisis detected if any keywords found
        crisis_detected = (high_score > 0 or medium_score > 0 or low_score > 0)
        
        # Immediate intervention needed for high severity
        immediate_intervention = (severity == "high")
        
        # Get appropriate resources
        resources = CRISIS_RESOURCES if crisis_detected else None
        
        return {
            "crisis_detected": crisis_detected,
            "severity": severity,
            "confidence": confidence,
            "keywords_found": keywords_found[:5],  # Top 5
            "immediate_intervention": immediate_intervention,
            "resources": resources,
            "scores": {
                "high": high_score,
                "medium": medium_score,
                "low": low_score,
                "protective": protective_score
            }
        }
    
    def _calculate_severity(
        self, 
        high: int, 
        medium: int, 
        low: int, 
        protective: int
    ) -> Tuple[str, float]:
        """
        Calculate crisis severity level
        
        Args:
            high: High-severity keyword count
            medium: Medium-severity keyword count
            low: Low-severity keyword count
            protective: Protective factor count
        
        Returns:
            Tuple of (severity_level, confidence_score)
        """
        # Calculate raw score
        raw_score = (high * 3) + (medium * 2) + (low * 1)
        
        # Reduce score based on protective factors
        adjusted_score = max(0, raw_score - protective)
        
        # Determine severity
        if high > 0 or adjusted_score >= 5:
            severity = "high"
            confidence = min(0.9 + (high * 0.05), 1.0)
        elif medium > 0 or adjusted_score >= 3:
            severity = "medium"
            confidence = 0.7 + (medium * 0.1)
        elif low > 0 or adjusted_score >= 1:
            severity = "low"
            confidence = 0.5 + (low * 0.1)
        else:
            severity = "none"
            confidence = 0.0
        
        return severity, min(confidence, 1.0)
    
    def get_intervention_message(self, severity: str) -> str:
        """
        Get appropriate intervention message based on severity
        
        Args:
            severity: Crisis severity level
        
        Returns:
            Intervention message
        """
        messages = {
            "high": (
                "I'm very concerned about what you're sharing. Your safety is the most important thing right now. "
                "Please reach out to a crisis counselor immediately. You don't have to face this alone."
            ),
            "medium": (
                "I hear that you're going through a really difficult time. It's important to talk to someone who can help. "
                "Please consider reaching out to a mental health professional or crisis support."
            ),
            "low": (
                "It sounds like you're struggling right now. It's okay to ask for help. "
                "Talking to a counselor or trusted person might be helpful."
            ),
            "none": ""
        }
        
        return messages.get(severity, "")
    
    def get_safety_plan_suggestions(self) -> List[str]:
        """
        Get safety plan suggestions
        
        Returns:
            List of safety plan items
        """
        return [
            "Identify warning signs that a crisis may be developing",
            "Use internal coping strategies (breathing, grounding)",
            "Reach out to people who can provide support",
            "Contact mental health professionals",
            "Remove or secure potentially harmful items",
            "Make your environment safe"
        ]


# Singleton instance
_crisis_detector = None

def get_crisis_detector() -> CrisisDetector:
    """Get or create crisis detector singleton"""
    global _crisis_detector
    if _crisis_detector is None:
        _crisis_detector = CrisisDetector()
    return _crisis_detector


# Example usage
if __name__ == "__main__":
    detector = CrisisDetector()
    
    test_texts = [
        "I want to kill myself. I can't take it anymore.",
        "I've been thinking about suicide lately. I feel hopeless.",
        "I'm tired of living. What's the point of anything?",
        "I'm having a bad day but I'll get through it.",
        "I have thoughts of self-harm but I'm seeking help from my therapist.",
    ]
    
    print("\n" + "="*70)
    print("CRISIS DETECTION TEST")
    print("="*70 + "\n")
    
    for text in test_texts:
        result = detector.detect_crisis(text)
        print(f"Text: {text}")
        print(f"Crisis Detected: {result['crisis_detected']}")
        print(f"Severity: {result['severity'].upper()} ({result['confidence']:.1%})")
        print(f"Immediate Intervention: {result['immediate_intervention']}")
        
        if result['keywords_found']:
            print(f"Keywords: {', '.join(result['keywords_found'])}")
        
        if result['crisis_detected']:
            print(f"\nIntervention: {detector.get_intervention_message(result['severity'])}")
            
            if result['resources']:
                print(f"\nCrisis Resources:")
                print(f"  Hotline: {result['resources']['hotline']['number']}")
                print(f"  Text: {result['resources']['text']['description']}")
        
        print("-" * 70 + "\n")
