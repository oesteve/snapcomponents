# Article CSV Import

This document describes how to use the CSV import functionality for articles.

## CSV Format

The CSV file should have the following columns:

- `name`: A unique identifier/slug for the article
- `title`: The article title
- `description`: A short description of the article
- `content`: The main content of the article

Example:

```csv
name,title,description,content
article-1,First Article,This is the first article,This is the content of the first article.
article-2,Second Article,This is the second article,This is the content of the second article.
```

## API Endpoint

To import articles from a CSV file, send a POST request to the following endpoint:

```
POST /api/articles/import/csv
```

The request should be a `multipart/form-data` request with a file field named `file` containing the CSV file.

### Authentication

The request must be authenticated. The imported articles will be associated with the authenticated user.

### Response

The response will be a JSON object with the following fields:

- `success`: The number of articles successfully imported
- `errors`: An array of error objects, each with a `line` and `message` field
- `articles`: An array of the successfully imported articles

Example response:

```json
{
  "success": 2,
  "errors": [
    {
      "line": 3,
      "message": "All fields are required."
    }
  ],
  "articles": [
    {
      "id": 1,
      "name": "article-1",
      "title": "First Article",
      "description": "This is the first article",
      "content": "This is the content of the first article."
    },
    {
      "id": 2,
      "name": "article-2",
      "title": "Second Article",
      "description": "This is the second article",
      "content": "This is the content of the second article."
    }
  ]
}
```

### Status Codes

- `200 OK`: All articles were imported successfully
- `207 Multi-Status`: Some articles were imported successfully, but there were errors with others
- `400 Bad Request`: No file was uploaded or the file is not a valid CSV file
- `401 Unauthorized`: The request is not authenticated

## Example Usage

Using curl:

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/articles.csv" \
  http://localhost:8000/api/articles/import/csv
```

Using JavaScript fetch:

```javascript
const formData = new FormData();
formData.append('file', csvFile);

fetch('/api/articles/import/csv', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```
