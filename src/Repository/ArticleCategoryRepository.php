<?php

namespace App\Repository;

use App\Entity\ArticleCategory;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends BaseRepository<ArticleCategory>
 */
class ArticleCategoryRepository extends BaseRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ArticleCategory::class);
    }
}
