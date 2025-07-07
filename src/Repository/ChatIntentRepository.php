<?php

namespace App\Repository;

use App\Entity\ChatIntent;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends BaseRepository<ChatIntent>
 */
class ChatIntentRepository extends BaseRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ChatIntent::class);
    }
}
