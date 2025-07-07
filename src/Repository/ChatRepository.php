<?php

namespace App\Repository;

use App\Entity\Chat;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends BaseRepository<Chat>
 */
class ChatRepository extends BaseRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Chat::class);
    }
}
