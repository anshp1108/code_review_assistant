"""
Code Analyzer Module
Handles code parsing, structure analysis, and basic quality checks.
"""

import ast
import re
import datetime
from typing import Dict, List, Any

class CodeAnalyzer:
    def __init__(self):
        self.supported_languages = {
            '.py': self.analyze_python,
            '.js': self.analyze_javascript,
            '.java': self.analyze_java,
            '.cpp': self.analyze_cpp,
            '.c': self.analyze_c,
            '.cs': self.analyze_csharp
        }

    def analyze_code(self, code_content: str, filename: str) -> Dict[str, Any]:
        """Main method to analyze code based on file extension."""
        file_extension = '.' + filename.rsplit('.', 1)[1].lower()

        # Basic analysis for all files
        basic_analysis = self.basic_analysis(code_content)

        # Language-specific analysis
        if file_extension in self.supported_languages:
            specific_analysis = self.supported_languages[file_extension](code_content)
        else:
            specific_analysis = self.generic_analysis(code_content)

        return {
            'basic_metrics': basic_analysis,
            'language_specific': specific_analysis,
            'filename': filename,
            'language': file_extension
        }

    def basic_analysis(self, code_content: str) -> Dict[str, Any]:
        """Perform basic code analysis."""
        lines = code_content.split('
')

        # Count different types of lines
        total_lines = len(lines)
        blank_lines = sum(1 for line in lines if not line.strip())
        comment_lines = sum(1 for line in lines if line.strip().startswith(('#', '//', '/*', '*')))
        code_lines = total_lines - blank_lines - comment_lines

        # Calculate basic metrics
        avg_line_length = sum(len(line) for line in lines) / max(total_lines, 1)

        # Find long lines (>80 characters)
        long_lines = [i+1 for i, line in enumerate(lines) if len(line) > 80]

        return {
            'total_lines': total_lines,
            'code_lines': code_lines,
            'blank_lines': blank_lines,
            'comment_lines': comment_lines,
            'average_line_length': round(avg_line_length, 2),
            'long_lines': long_lines,
            'comment_ratio': round(comment_lines / max(total_lines, 1), 2)
        }

    def analyze_python(self, code_content: str) -> Dict[str, Any]:
        """Analyze Python-specific code patterns."""
        try:
            tree = ast.parse(code_content)

            functions = []
            classes = []
            imports = []

            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    functions.append({
                        'name': node.name,
                        'line': node.lineno,
                        'args_count': len(node.args.args),
                        'has_docstring': ast.get_docstring(node) is not None
                    })
                elif isinstance(node, ast.ClassDef):
                    classes.append({
                        'name': node.name,
                        'line': node.lineno,
                        'has_docstring': ast.get_docstring(node) is not None
                    })
                elif isinstance(node, ast.Import):
                    for alias in node.names:
                        imports.append({'name': alias.name, 'line': node.lineno})
                elif isinstance(node, ast.ImportFrom):
                    module = node.module or ''
                    for alias in node.names:
                        imports.append({'name': f"{module}.{alias.name}", 'line': node.lineno})

            # Check for common issues
            issues = []
            if len([f for f in functions if not f['has_docstring']]) > 0:
                issues.append("Some functions lack docstrings")

            if len([c for c in classes if not c['has_docstring']]) > 0:
                issues.append("Some classes lack docstrings")

            return {
                'functions': functions,
                'classes': classes,
                'imports': imports,
                'function_count': len(functions),
                'class_count': len(classes),
                'import_count': len(imports),
                'potential_issues': issues
            }

        except SyntaxError as e:
            return {'error': f'Syntax error: {str(e)}', 'line': e.lineno}
        except Exception as e:
            return {'error': f'Analysis error: {str(e)}'}

    def analyze_javascript(self, code_content: str) -> Dict[str, Any]:
        """Analyze JavaScript-specific patterns."""
        # Simple regex-based analysis for JavaScript
        functions = re.findall(r'function\s+(\w+)\s*\(', code_content)
        arrow_functions = re.findall(r'const\s+(\w+)\s*=\s*\([^)]*\)\s*=>', code_content)
        variables = re.findall(r'(?:var|let|const)\s+(\w+)', code_content)

        return {
            'functions': functions,
            'arrow_functions': arrow_functions,
            'variables': variables,
            'function_count': len(functions) + len(arrow_functions),
            'variable_count': len(variables)
        }

    def analyze_java(self, code_content: str) -> Dict[str, Any]:
        """Analyze Java-specific patterns."""
        classes = re.findall(r'class\s+(\w+)', code_content)
        methods = re.findall(r'\b(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\(', code_content)

        return {
            'classes': classes,
            'methods': methods,
            'class_count': len(classes),
            'method_count': len(methods)
        }

    def analyze_cpp(self, code_content: str) -> Dict[str, Any]:
        """Analyze C++ specific patterns."""
        return self.analyze_c(code_content)  # Similar analysis

    def analyze_c(self, code_content: str) -> Dict[str, Any]:
        """Analyze C-specific patterns."""
        functions = re.findall(r'\w+\s+(\w+)\s*\([^)]*\)\s*\{', code_content)
        includes = re.findall(r'#include\s*[<"](.*?)[>"]', code_content)

        return {
            'functions': functions,
            'includes': includes,
            'function_count': len(functions),
            'include_count': len(includes)
        }

    def analyze_csharp(self, code_content: str) -> Dict[str, Any]:
        """Analyze C# specific patterns."""
        classes = re.findall(r'class\s+(\w+)', code_content)
        methods = re.findall(r'\b(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\(', code_content)

        return {
            'classes': classes,
            'methods': methods,
            'class_count': len(classes),
            'method_count': len(methods)
        }

    def generic_analysis(self, code_content: str) -> Dict[str, Any]:
        """Generic analysis for unsupported languages."""
        return {
            'note': 'Generic analysis - language-specific features not available',
            'character_count': len(code_content)
        }

    def get_timestamp(self) -> str:
        """Get current timestamp."""
        return datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
