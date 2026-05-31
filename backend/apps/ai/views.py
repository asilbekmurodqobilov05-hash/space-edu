import json
import urllib.request
import urllib.error
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from decouple import config

class AiChatView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        messages = request.data.get('messages', [])
        context = request.data.get('context', '')
        mode = request.data.get('mode', 'explain')

        gemini_key = config('GEMINI_API_KEY', default=None) or getattr(settings, 'GEMINI_API_KEY', None)
        if not gemini_key:
            return Response(
                {'detail': 'Gemini API key is not configured on the server.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Build contents payload
        contents = []
        for msg in messages:
            role = "user" if msg.get("role") == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg.get("text", "")}]
            })

        # Build system instruction based on mode and context
        m = "MODE: QUIZ. Short multiple-choice or recall checks."
        if mode == "deep":
            m = "MODE: DEEP DIVE. Precise vocabulary, formulas, observatories."
        elif mode == "explain":
            m = "MODE: EXPLAIN. Intuitive, then detail; analogies and bullet steps."

        system_instruction = (
            f"You are the Space edu AI tutor for \"Space edu\" platform (Uzbekistan + international, ages 10-18).\n"
            f"{m}\n"
            f"CURRENT TOPIC: {context or 'General space science'}\n"
            f"Be accurate, encouraging. Mention Central Asian contributions when relevant. Prefer Socratic hints. "
            f"Structure with headings and numbered steps."
        )

        temperature = 0.75
        if mode == "quiz":
            temperature = 0.45
        elif mode == "deep":
            temperature = 0.65

        # Call Gemini API via raw REST request to be 100% robust and avoid library issues
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}"
        
        payload = {
            "contents": contents,
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            },
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": 2048
            }
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                
                # Extract text from response
                candidates = res_data.get('candidates', [])
                if candidates:
                    parts = candidates[0].get('content', {}).get('parts', [])
                    if parts:
                        reply_text = parts[0].get('text', '')
                        return Response({'reply': reply_text}, status=status.HTTP_200_OK)
                
                return Response({'reply': "I couldn't generate a reply."}, status=status.HTTP_200_OK)

        except urllib.error.HTTPError as e:
            try:
                error_body = e.read().decode('utf-8')
                error_json = json.loads(error_body)
                error_detail = error_json.get('error', {}).get('message', str(e))
            except Exception:
                error_detail = str(e)
            return Response(
                {'detail': f"Gemini API error: {error_detail}"},
                status=status.HTTP_502_BAD_GATEWAY
            )
        except Exception as e:
            return Response(
                {'detail': f"Server encountered an error while calling Gemini API: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
