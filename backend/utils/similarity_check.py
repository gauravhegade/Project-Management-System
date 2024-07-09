from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L6-v2')  

@app.route('/similarity', methods=['POST'])
def similarity():
    data = request.json
    topic1 = data.get('topic1')
    topic2 = data.get('topic2')

    if not topic1 or not topic2:
        return jsonify({'error': 'Both topics must be provided.'}), 400

    embeddings = model.encode([topic1, topic2])
    similarity_score = util.cos_sim(embeddings[0], embeddings[1]).item()

    return jsonify({'similarity': similarity_score})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
