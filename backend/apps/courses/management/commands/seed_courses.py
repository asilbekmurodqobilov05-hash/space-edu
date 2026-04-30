import json
import os
from django.core.management.base import BaseCommand
from apps.courses.models import Level, Unit, Lesson, LessonSection, QuizQuestion

class Command(BaseCommand):
    help = 'Seeds courses from learningData.json'

    def handle(self, *args, **options):
        json_path = os.path.join(os.path.dirname(__file__), '../../../../../frontend/learningData.json')
        
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        Level.objects.all().delete()

        for level_data in data:
            level = Level.objects.create(
                slug=level_data['id'],
                order=level_data['levelNumber'],
                title_en=level_data['title'],
                title_uz=level_data['title'],
                title_ru=level_data['title'],
                description_en=level_data['description'],
                description_uz=level_data['description'],
                description_ru=level_data['description'],
                icon='Rocket',
                color='#8b5cf6'
            )

            for unit_idx, unit_data in enumerate(level_data.get('units', [])):
                unit = Unit.objects.create(
                    level=level,
                    slug=unit_data['id'],
                    order=unit_idx + 1,
                    title_en=unit_data['title'],
                    title_uz=unit_data['title'],
                    title_ru=unit_data['title'],
                    xp_reward=100,
                    fuel_reward=50
                )

                for lesson_idx, lesson_data in enumerate(unit_data.get('lessons', [])):
                    lesson = Lesson.objects.create(
                        unit=unit,
                        slug=lesson_data['id'],
                        order=lesson_idx + 1,
                        title_en=lesson_data['title'],
                        title_uz=lesson_data['title'],
                        title_ru=lesson_data['title'],
                        lesson_type='explanation',
                        xp_reward=lesson_data.get('xpReward', 50),
                        estimated_minutes=10
                    )

                    section_order = 1
                    for section_data in lesson_data.get('sections', []):
                        if section_data['type'] == 'practice':
                            for q_idx, q_data in enumerate(section_data.get('practiceExercises', [])):
                                options = q_data.get('options', [])
                                formatted_options = [{"id": chr(65+i), "en": opt, "uz": opt, "ru": opt} for i, opt in enumerate(options)]
                                correct_index = q_data.get('correctAnswerIndex', 0)
                                correct_char = chr(65+correct_index)
                                
                                QuizQuestion.objects.create(
                                    lesson=lesson,
                                    order=q_idx + 1,
                                    text_en=q_data.get('question', ''),
                                    text_uz=q_data.get('question', ''),
                                    text_ru=q_data.get('question', ''),
                                    options=formatted_options,
                                    correct_answer=correct_char,
                                    explanation_en=q_data.get('explanation', ''),
                                    explanation_uz=q_data.get('explanation', ''),
                                    explanation_ru=q_data.get('explanation', '')
                                )
                        else:
                            content_text = ""
                            if 'content' in section_data:
                                content_text = "\n\n".join(section_data['content'])
                            if 'videoUrl' in section_data:
                                content_text += f"\n\nVideo: {section_data['videoUrl']}"
                            if 'examples' in section_data:
                                for ex in section_data['examples']:
                                    content_text += f"\n\nProblem: {ex['problem']}\nSolution: {ex['solution']}"
                                    
                            LessonSection.objects.create(
                                lesson=lesson,
                                order=section_order,
                                section_type=section_data['type'],
                                content_en={"text": content_text},
                                content_uz={"text": content_text},
                                content_ru={"text": content_text}
                            )
                            section_order += 1

        self.stdout.write(self.style.SUCCESS('Successfully seeded learning data!'))
