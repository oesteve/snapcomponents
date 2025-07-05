<?php

namespace App\Service\Import;

use App\Entity\Article;
use App\Entity\ArticleCategory;
use App\Entity\User;
use App\Repository\ArticleCategoryRepository;
use App\Repository\ArticleRepository;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ArticleImportService
{
    public function __construct(
        private readonly ArticleRepository $articleRepository,
        private readonly ArticleCategoryRepository $categoryRepository,
    ) {
    }

    /**
     * Import articles from a CSV file
     *
     * @param UploadedFile $file The uploaded CSV file
     * @param User $user The user to associate with the imported articles
     * @return array{success: array<int, Article>, errors: array<int, array{line: int, message: string}>}
     */
    public function importFromCsv(UploadedFile $file, User $user): array
    {
        $result = [
            'success' => [],
            'errors' => [],
        ];

        // Check if the file is a CSV
        if ($file->getMimeType() !== 'text/csv' && $file->getClientOriginalExtension() !== 'csv') {
            $result['errors'][] = [
                'line' => 0,
                'message' => 'The file is not a CSV file.',
            ];
            return $result;
        }

        // Open the file
        $handle = fopen($file->getPathname(), 'r');
        if ($handle === false) {
            $result['errors'][] = [
                'line' => 0,
                'message' => 'Could not open the file.',
            ];
            return $result;
        }

        // Read the header row
        $header = fgetcsv($handle);
        if ($header === false) {
            $result['errors'][] = [
                'line' => 0,
                'message' => 'The file is empty.',
            ];
            fclose($handle);
            return $result;
        }

        // Validate the header
        $requiredColumns = ['title', 'description', 'content', 'category_name'];
        $missingColumns = array_diff($requiredColumns, $header);
        if (!empty($missingColumns)) {
            $result['errors'][] = [
                'line' => 1,
                'message' => 'Missing required columns: ' . implode(', ', $missingColumns),
            ];
            fclose($handle);
            return $result;
        }

        // Map column indices
        $columnMap = array_flip($header);

        // Read and process each row
        $lineNumber = 2; // Start at 2 because line 1 is the header
        while (($row = fgetcsv($handle)) !== false) {
            // Skip empty rows
            if (count($row) === 1 && empty($row[0])) {
                $lineNumber++;
                continue;
            }

            // Validate row
            if (count($row) !== count($header)) {
                $result['errors'][] = [
                    'line' => $lineNumber,
                    'message' => 'Invalid number of columns.',
                ];
                $lineNumber++;
                continue;
            }

            // Extract data
            $title = $row[$columnMap['title']] ?? '';
            $description = $row[$columnMap['description']] ?? '';
            $content = $row[$columnMap['content']] ?? '';
            $categoryName = $row[$columnMap['category_name']] ?? '';

            // Validate data
            if (empty($title) || empty($description) || empty($content) || empty($categoryName)) {
                $result['errors'][] = [
                    'line' => $lineNumber,
                    'message' => 'All fields are required.',
                ];
                $lineNumber++;
                continue;
            }

            // Validate and fetch or create category
            try {
                $category = $this->categoryRepository->findOneBy(['name' => $categoryName]);
                if ($category === null) {
                    // Create a new category if it doesn't exist
                    $category = new ArticleCategory($categoryName);
                    $this->categoryRepository->save($category);
                }
            } catch (\Exception $e) {
                $result['errors'][] = [
                    'line' => $lineNumber,
                    'message' => 'Error processing category: ' . $e->getMessage(),
                ];
                $lineNumber++;
                continue;
            }

            try {
                // Create and save the article
                $article = new Article(
                    $title,
                    $description,
                    $content,
                    $user,
                    $category
                );

                $this->articleRepository->save($article);
                $result['success'][] = $article;
            } catch (\Exception $e) {
                $result['errors'][] = [
                    'line' => $lineNumber,
                    'message' => 'Error creating article: ' . $e->getMessage(),
                ];
            }

            $lineNumber++;
        }

        fclose($handle);
        return $result;
    }
}
