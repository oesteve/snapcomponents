<?php

namespace App\Repository;

use App\Entity\Agent;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends BaseRepository<Agent>
 */
class AgentRepository extends BaseRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Agent::class);
    }
}
