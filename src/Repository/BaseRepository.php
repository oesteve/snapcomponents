<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @template T of object
 *
 * @template-extends ServiceEntityRepository<T>
 */
abstract class BaseRepository extends ServiceEntityRepository
{
    /**
     * @param class-string<T> $class
     */
    public function __construct(ManagerRegistry $registry, string $class)
    {
        parent::__construct($registry, $class);
    }

    /**
     * @return T
     */
    public function findOrFail(int $id): object
    {
        return $this->find($id) ?? throw new \InvalidArgumentException('Entity not found');
    }

    /**
     * @param T $entity
     */
    public function save(object $entity): void
    {
        if (!str_contains($entity::class, $this->getEntityName())) {
            throw new \InvalidArgumentException('Entity must be an instance of '.$this->getEntityName());
        }

        $entityManager = $this->getEntityManager();
        $entityManager->persist($entity);
        $entityManager->flush();
    }

    /**
     * @param T $entity
     */
    public function remove(object $entity): void
    {
        if (get_class($entity) !== $this->getEntityName()) {
            throw new \InvalidArgumentException('Entity must be an instance of '.$this->getEntityName());
        }

        $entityManager = $this->getEntityManager();
        $entityManager->remove($entity);
        $entityManager->flush();
    }

    /**
     * @param array<int, int> $positions
     */
    public function setPositions(array $positions): void
    {
        $cases = [];
        $ids = [];

        foreach ($positions as $position => $id) {
            $cases[] = "WHEN e.id = {$id} THEN {$position}";
            $ids[] = $id;
        }

        if (empty($ids)) {
            return;
        }

        $dql = sprintf(
            'UPDATE %s e SET e.position = CASE %s ELSE 0 END WHERE e.id IN (:ids)',
            $this->getEntityName(),
            implode(' ', $cases)
        );
        $query = $this->getEntityManager()->createQuery(
            $dql
        )->setParameter('ids', $ids);

        $query->execute();
    }
}
