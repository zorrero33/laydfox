#include "AI/TurnoGhostCharacter.h"
#include "AI/TurnoGhostAIController.h"
#include "GameFramework/CharacterMovementComponent.h"

ATurnoGhostCharacter::ATurnoGhostCharacter()
{
    PrimaryActorTick.bCanEverTick = false;
    AIControllerClass = ATurnoGhostAIController::StaticClass();
    AutoPossessAI = EAutoPossessAI::PlacedInWorldOrSpawned;
    bUseControllerRotationYaw = false;
    GetCharacterMovement()->bOrientRotationToMovement = true;
    GetCharacterMovement()->MaxWalkSpeed = 245.0f;
}

void ATurnoGhostCharacter::SetGhostState(ETurnoGhostState NewState)
{
    GhostState = NewState;
}