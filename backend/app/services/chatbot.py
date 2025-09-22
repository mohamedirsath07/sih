import json
import os
import re
from typing import List, Dict, Any

class EnhancedChatbot:
    def __init__(self):
        self.data_sources = {}
        self.load_all_data()
        
    def load_all_data(self):
        """Load all data sources for the chatbot"""
        data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'jk')
        
        # Load different data sources
        data_files = {
            'colleges': 'seed_colleges.json',
            'scholarships': 'seed_scholarships.json',
            'careers': 'seed_careers.json',
            'timelines': 'seed_timelines.json'
        }
        
        for key, filename in data_files.items():
            filepath = os.path.join(data_dir, filename)
            if os.path.exists(filepath):
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        self.data_sources[key] = json.load(f)
                except Exception as e:
                    print(f"Error loading {filename}: {e}")
                    self.data_sources[key] = []
            else:
                self.data_sources[key] = []
                
        # Load FAQ data
        faq_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'frontend', 'src', 'chatbot', 'faq.json')
        if os.path.exists(faq_path):
            try:
                with open(faq_path, 'r', encoding='utf-8') as f:
                    faq_data = json.load(f)
                    self.data_sources['faq'] = faq_data.get('faq', [])
            except Exception as e:
                print(f"Error loading FAQ: {e}")
                self.data_sources['faq'] = []
    
    def extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from user input"""
        # Convert to lowercase and split into words
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Filter out common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'what', 'how', 'where', 'when', 'why', 'who', 'which', 'can', 'could', 'should', 'would', 'will', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'}
        keywords = [word for word in words if word not in stop_words and len(word) > 2]
        
        return keywords
    
    def search_colleges(self, query: str, keywords: List[str]) -> List[Dict]:
        """Search for relevant colleges"""
        results = []
        query_lower = query.lower()
        
        for college in self.data_sources.get('colleges', []):
            score = 0
            match_reasons = []
            
            # Check college name
            if any(keyword in college['name'].lower() for keyword in keywords):
                score += 3
                match_reasons.append("name match")
            
            # Check location
            if any(keyword in college['location'].lower() for keyword in keywords):
                score += 2
                match_reasons.append("location match")
            
            # Check courses
            for course in college.get('courses_offered', []):
                if any(keyword in course.lower() for keyword in keywords):
                    score += 1
                    match_reasons.append(f"offers {course}")
            
            # Check for specific queries
            if 'engineering' in query_lower and any('tech' in course.lower() or 'engineering' in course.lower() for course in college.get('courses_offered', [])):
                score += 2
            
            if score > 0:
                results.append({
                    'college': college,
                    'score': score,
                    'reasons': match_reasons
                })
        
        # Sort by score
        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:5]  # Return top 5 matches
    
    def search_scholarships(self, query: str, keywords: List[str]) -> List[Dict]:
        """Search for relevant scholarships"""
        results = []
        query_lower = query.lower()
        
        for scholarship in self.data_sources.get('scholarships', []):
            score = 0
            match_reasons = []
            
            # Check scholarship name and details
            text_fields = [scholarship['name'], scholarship.get('details', ''), scholarship.get('eligibility', '')]
            for field in text_fields:
                if any(keyword in field.lower() for keyword in keywords):
                    score += 1
                    match_reasons.append("criteria match")
            
            # Check for specific scholarship types
            if 'merit' in query_lower and 'merit' in scholarship['name'].lower():
                score += 2
            if 'need' in query_lower and 'need' in scholarship['name'].lower():
                score += 2
            if 'girl' in query_lower or 'women' in query_lower:
                if 'girl' in scholarship['name'].lower() or 'women' in scholarship['name'].lower():
                    score += 2
            
            if score > 0:
                results.append({
                    'scholarship': scholarship,
                    'score': score,
                    'reasons': match_reasons
                })
        
        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:5]
    
    def search_careers(self, query: str, keywords: List[str]) -> List[Dict]:
        """Search for relevant careers"""
        results = []
        
        for career in self.data_sources.get('careers', []):
            score = 0
            match_reasons = []
            
            # Check career name and description
            if any(keyword in career['career'].lower() for keyword in keywords):
                score += 3
                match_reasons.append("career title match")
            
            if any(keyword in career['description'].lower() for keyword in keywords):
                score += 2
                match_reasons.append("description match")
            
            # Check related courses
            for course in career.get('related_courses', []):
                if any(keyword in course.lower() for keyword in keywords):
                    score += 1
                    match_reasons.append(f"related to {course}")
            
            if score > 0:
                results.append({
                    'career': career,
                    'score': score,
                    'reasons': match_reasons
                })
        
        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:3]
    
    def check_faq(self, query: str) -> str:
        """Check FAQ for direct answers"""
        query_lower = query.lower()
        
        for faq_item in self.data_sources.get('faq', []):
            question_lower = faq_item['question'].lower()
            
            # Check for exact or partial matches
            if query_lower in question_lower or question_lower in query_lower:
                return faq_item['answer']
            
            # Check for keyword matches
            query_words = set(re.findall(r'\b\w+\b', query_lower))
            question_words = set(re.findall(r'\b\w+\b', question_lower))
            
            # If 60% of query words are in the question, it's a match
            if len(query_words) > 0 and len(query_words.intersection(question_words)) / len(query_words) >= 0.6:
                return faq_item['answer']
        
        return None
    
    def generate_response(self, query: str, user_profile: Dict = None) -> str:
        """Generate intelligent response based on query and available data"""
        keywords = self.extract_keywords(query)
        query_lower = query.lower()
        
        # First check FAQ for direct answers
        faq_answer = self.check_faq(query)
        if faq_answer:
            return faq_answer
        
        responses = []
        
        # Determine query intent and search accordingly
        if any(word in query_lower for word in ['college', 'university', 'institution', 'admission']):
            college_results = self.search_colleges(query, keywords)
            if college_results:
                responses.append("🏫 **Colleges I found:**")
                for result in college_results[:3]:
                    college = result['college']
                    responses.append(f"• **{college['name']}** ({college['location']})")
                    if college.get('courses_offered'):
                        responses.append(f"  Courses: {', '.join(college['courses_offered'][:3])}")
                    if college.get('facilities'):
                        responses.append(f"  Facilities: {', '.join(college['facilities'][:3])}")
                    responses.append("")
        
        elif any(word in query_lower for word in ['scholarship', 'financial aid', 'funding', 'grant']):
            scholarship_results = self.search_scholarships(query, keywords)
            if scholarship_results:
                responses.append("💰 **Scholarships available:**")
                for result in scholarship_results[:3]:
                    scholarship = result['scholarship']
                    responses.append(f"• **{scholarship['name']}** - ₹{scholarship['amount']:,}")
                    responses.append(f"  Eligibility: {scholarship.get('eligibility', 'N/A')}")
                    if scholarship.get('application_deadline'):
                        responses.append(f"  Deadline: {scholarship['application_deadline']}")
                    responses.append("")
        
        elif any(word in query_lower for word in ['career', 'job', 'profession', 'work', 'salary']):
            career_results = self.search_careers(query, keywords)
            if career_results:
                responses.append("💼 **Career options:**")
                for result in career_results:
                    career = result['career']
                    responses.append(f"• **{career['career']}**")
                    responses.append(f"  {career['description']}")
                    responses.append(f"  Salary: {career.get('average_salary', 'Varies')}")
                    if career.get('related_courses'):
                        responses.append(f"  Relevant courses: {', '.join(career['related_courses'][:2])}")
                    responses.append("")
        
        # If no specific results found, provide general guidance
        if not responses:
            if any(word in query_lower for word in ['help', 'guidance', 'advice']):
                responses.append("I'm here to help! You can ask me about:")
                responses.append("🏫 Colleges - 'Tell me about engineering colleges'")
                responses.append("💰 Scholarships - 'Show me merit-based scholarships'")
                responses.append("💼 Careers - 'What careers are available in IT?'")
                responses.append("📚 Courses - 'What courses are offered in Jammu?'")
            else:
                responses.append("I couldn't find specific information about that. Try asking about:")
                responses.append("• Colleges in your area")
                responses.append("• Available scholarships")
                responses.append("• Career opportunities")
                responses.append("• Course information")
        
        return "\n".join(responses) if responses else "I'm still learning! Please try rephrasing your question or ask about colleges, scholarships, or careers."

# Global chatbot instance
enhanced_chatbot = EnhancedChatbot()