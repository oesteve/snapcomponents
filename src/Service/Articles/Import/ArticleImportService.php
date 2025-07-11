<?php

namespace App\Service\Articles\Import;

use App\Entity\Agent;
use App\Entity\Article;
use App\Entity\ArticleCategory;
use App\Repository\AgentRepository;
use App\Repository\ArticleCategoryRepository;
use App\Repository\ArticleRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\MessageBusInterface;

class ArticleImportService
{
    public function __construct(
        private readonly ArticleRepository $articleRepository,
        private readonly ArticleCategoryRepository $categoryRepository,
        private readonly MessageBusInterface $messageBus,
        private readonly AgentRepository $agentRepository,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Import articles from a CSV file.
     *
     * @param UploadedFile $file  The uploaded CSV file
     * @param Agent        $agent The agent to associate with the imported articles
     *
     * @return array{total: int, errors: array<int, array{line: int, message: string}>}
     */
    public function importFromCsv(UploadedFile $file, Agent $agent): array
    {
        $result = [
            'total' => 0,
            'errors' => [],
        ];

        // First part: Validate the CSV data
        $validationResult = $this->validateCsvData($file);

        if (!empty($validationResult['errors'])) {
            $result['errors'] = $validationResult['errors'];

            return $result;
        }

        // Second part: Dispatch messages for each valid row
        return $this->dispatchMessagesForValidData(
            $validationResult['data'],
            $agent
        );
    }

    /**
     * Validate the CSV file and its data.
     *
     * @param UploadedFile $file The uploaded CSV file
     *
     * @return array{errors: array<int, array{line: int, message: string}>, data: array<int, array{line: int, data: array<string, string>}>}
     */
    private function validateCsvData(UploadedFile $file): array
    {
        $result = [
            'errors' => [],
            'data' => [],
        ];

        // Check if the file is a CSV
        if ('text/csv' !== $file->getMimeType() && 'csv' !== $file->getClientOriginalExtension()) {
            $result['errors'][] = [
                'line' => 0,
                'message' => 'The file is not a CSV file.',
            ];

            return $result;
        }

        // Open the file
        $handle = fopen($file->getPathname(), 'r');
        if (false === $handle) {
            $result['errors'][] = [
                'line' => 0,
                'message' => 'Could not open the file.',
            ];

            return $result;
        }

        // Read the header row
        $header = fgetcsv($handle);
        if (false === $header) {
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
                'message' => 'Missing required columns: '.implode(', ', $missingColumns),
            ];
            fclose($handle);

            return $result;
        }

        // Read and validate each row
        $lineNumber = 2; // Start at 2 because line 1 is the header
        $validRows = [];

        while (($row = fgetcsv($handle)) !== false) {
            // Skip empty rows
            if (1 === count($row) && empty($row[0])) {
                ++$lineNumber;
                continue;
            }

            // Validate row
            if (count($row) !== count($header)) {
                $result['errors'][] = [
                    'line' => $lineNumber,
                    'message' => 'Invalid number of columns.',
                ];
                ++$lineNumber;
                continue;
            }

            // Create associative array with headers as keys
            $rowData = array_combine($header, $row);

            // Extract data for validation
            $title = $rowData['title'] ?? '';
            $description = $rowData['description'] ?? '';
            $content = $rowData['content'] ?? '';
            $categoryName = $rowData['category_name'] ?? '';

            // Validate data
            if (empty($title) || empty($description) || empty($content) || empty($categoryName)) {
                $result['errors'][] = [
                    'line' => $lineNumber,
                    'message' => 'All fields are required.',
                ];
                ++$lineNumber;
                continue;
            }

            // Store valid row data
            $validRows[] = [
                'line' => $lineNumber,
                'data' => $rowData,
            ];

            ++$lineNumber;
        }

        fclose($handle);
        $result['data'] = $validRows;

        return $result;
    }

    /**
     * Dispatch messages for validated data.
     *
     * @param array<int, array{line: int, data: array<string, string>}> $validatedData The validated data from CSV
     * @param Agent                                                     $agent         The agent to associate with the imported articles
     *
     * @return array{total: int, errors: array<int, array{line: int, message: string}>}
     */
    private function dispatchMessagesForValidData(array $validatedData, Agent $agent): array
    {
        $result = [
            'total' => 0,
            'errors' => [],
        ];

        foreach ($validatedData as $row) {
            $lineNumber = $row['line'];
            $data = $row['data'];

            try {
                // Dispatch a message for each valid row
                $message = new ImportArticle(
                    $data,
                    $agent->getId(),
                    $lineNumber
                );

                $this->messageBus->dispatch($message);
                ++$result['total'];
            } catch (\Exception $e) {
                $result['errors'][] = [
                    'line' => $lineNumber,
                    'message' => 'Error dispatching import message: '.$e->getMessage(),
                ];
            }
        }

        return $result;
    }

    /**
     * Handle ImportArticle message.
     *
     * @param ImportArticle $message The message to handle
     */
    #[AsMessageHandler]
    public function handleImportArticle(ImportArticle $message): void
    {
        $this->logger->info('Importing article', [
            'lineNumber' => $message->lineNumber,
            'data' => $message->data,
            'agentId' => $message->agentId,
        ]);

        $data = $message->data;
        $agentId = $message->agentId;
        $lineNumber = $message->lineNumber;

        // Get the agent
        $agent = $this->agentRepository->find($agentId);
        if (null === $agent) {
            $this->logger->error('Agent not found for article import', [
                'agentId' => $agentId,
                'lineNumber' => $lineNumber,
            ]);

            return;
        }

        $title = $data['title'] ?? '';
        $description = $data['description'] ?? '';
        $content = $data['content'] ?? '';
        $categoryName = $data['category_name'] ?? '';

        // Validate and fetch or create a category
        $category = $this->categoryRepository->findOneBy(['name' => $categoryName]);
        if (null === $category) {
            // Create a new category if it doesn't exist
            $category = new ArticleCategory($categoryName);
            $this->categoryRepository->save($category);
        }

        // Create and save the article
        $article = new Article(
            $title,
            $description,
            $content,
            $agent,
            $category
        );

        $this->articleRepository->save($article);

        $this->logger->info('Article imported successfully', [
            'articleId' => $article->getId(),
            'lineNumber' => $lineNumber,
        ]);
    }
}
