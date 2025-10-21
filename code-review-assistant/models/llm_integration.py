"""
LLM Integration Module
Handles OpenAI API communication for code review analysis.
"""

import os
import openai
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class LLMIntegration:
    def __init__(self):
        # Initialize OpenAI client
        self.api_key = os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            logger.warning("OpenAI API key not found. Set OPENAI_API_KEY environment variable.")
            self.client = None
        else:
            openai.api_key = self.api_key
            self.client = openai

    def get_code_review(self, code_content: str, filename: str) -> Dict[str, Any]:
        """Generate code review using OpenAI LLM."""
        if not self.client:
            return {
                'error': 'OpenAI API key not configured',
                'suggestion': 'Set OPENAI_API_KEY environment variable'
            }

        try:
            # Determine programming language from filename
            language = self.detect_language(filename)

            # Create review prompt
            prompt = self.create_review_prompt(code_content, language, filename)

            # Call OpenAI API
            response = self.client.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert code reviewer. Analyze the provided code for readability, modularity, potential bugs, performance issues, and best practices. Provide constructive feedback and specific improvement suggestions."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.3
            )

            # Parse response
            review_text = response.choices[0].message.content

            # Structure the response
            return {
                'review_text': review_text,
                'language': language,
                'model_used': 'gpt-3.5-turbo',
                'suggestions': self.extract_suggestions(review_text),
                'severity_levels': self.assess_severity(review_text)
            }

        except Exception as e:
            logger.error(f"Error calling OpenAI API: {str(e)}")
            return {
                'error': f'Failed to generate review: {str(e)}',
                'fallback_review': self.generate_fallback_review(code_content, filename)
            }

    def detect_language(self, filename: str) -> str:
        """Detect programming language from filename."""
        extension_map = {
            '.py': 'Python',
            '.js': 'JavaScript',
            '.java': 'Java',
            '.cpp': 'C++',
            '.c': 'C',
            '.cs': 'C#',
            '.php': 'PHP',
            '.rb': 'Ruby',
            '.go': 'Go',
            '.rs': 'Rust',
            '.swift': 'Swift',
            '.kt': 'Kotlin',
            '.scala': 'Scala',
            '.ts': 'TypeScript'
        }

        extension = '.' + filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        return extension_map.get(extension, 'Unknown')

    def create_review_prompt(self, code_content: str, language: str, filename: str) -> str:
        """Create a structured prompt for code review."""
        return f"""
Please review the following {language} code from file '{filename}':

```{language.lower()}
{code_content}
```

Please analyze this code and provide feedback on:

1. **Code Structure & Organization**
   - Overall code organization and modularity
   - Function/class design and responsibilities
   - Code readability and maintainability

2. **Best Practices**
   - Adherence to {language} coding standards
   - Naming conventions
   - Documentation and comments

3. **Potential Issues**
   - Logic errors or bugs
   - Performance concerns
   - Security vulnerabilities

4. **Improvement Suggestions**
   - Specific recommendations for enhancement
   - Refactoring opportunities
   - Optimization possibilities

Please format your response with clear sections and specific line references where applicable.
"""

    def extract_suggestions(self, review_text: str) -> list:
        """Extract key suggestions from review text."""
        # Simple extraction - could be enhanced with NLP
        suggestions = []
        lines = review_text.split('\n')

        for line in lines:
            if any(keyword in line.lower() for keyword in ['suggest', 'recommend', 'should', 'consider']):
                suggestions.append(line.strip())

        return suggestions[:10]  # Limit to top 10 suggestions

    def assess_severity(self, review_text: str) -> Dict[str, int]:
        """Assess severity levels based on review content."""
        high_keywords = ['critical', 'severe', 'security', 'vulnerability', 'bug']
        medium_keywords = ['improvement', 'optimize', 'refactor', 'enhance']
        low_keywords = ['minor', 'style', 'formatting', 'comment']

        review_lower = review_text.lower()

        return {
            'high': sum(1 for keyword in high_keywords if keyword in review_lower),
            'medium': sum(1 for keyword in medium_keywords if keyword in review_lower),
            'low': sum(1 for keyword in low_keywords if keyword in review_lower)
        }

    def generate_fallback_review(self, code_content: str, filename: str) -> Dict[str, Any]:
        """Generate a basic review when LLM is unavailable."""
        lines = code_content.split('\n')

        basic_feedback = []

        # Basic checks
        if len(lines) > 100:
            basic_feedback.append("File is quite large (>100 lines). Consider splitting into smaller modules.")

        long_lines = [i+1 for i, line in enumerate(lines) if len(line) > 80]
        if long_lines:
            basic_feedback.append(f"Lines {', '.join(map(str, long_lines[:5]))} are too long (>80 characters).")

        # Check for basic patterns
        if '# TODO' in code_content or '// TODO' in code_content:
            basic_feedback.append("TODO comments found - consider addressing them.")

        if not basic_feedback:
            basic_feedback.append("No obvious issues detected in basic analysis.")

        return {
            'review_text': '\n'.join(basic_feedback),
            'type': 'fallback_review',
            'note': 'Basic analysis performed - LLM review unavailable'
        }
