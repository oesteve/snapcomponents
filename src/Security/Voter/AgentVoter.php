<?php

namespace App\Security\Voter;

use App\Entity\Agent;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

final class AgentVoter extends Voter
{
    public const EDIT = 'AGENT_EDIT';
    public const VIEW = 'AGENT_VIEW';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::VIEW])
            && $subject instanceof Agent;
    }

    /**
     * @param Agent $subject
     */
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        // ... (check conditions and return true to grant permission) ...
        switch ($attribute) {
            case self::EDIT:
                return $user->getAgents()->contains($subject);
            case self::VIEW:
                // For now, if a user can edit, they can also view
                return $user->getAgents()->contains($subject);
        }

        return false;
    }
}
