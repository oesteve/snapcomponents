<?php

namespace App\Repository;

use App\Entity\ChatConfiguration;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends BaseRepository<ChatConfiguration>
 */
class ChatConfigurationRepository extends BaseRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ChatConfiguration::class);
    }
}
