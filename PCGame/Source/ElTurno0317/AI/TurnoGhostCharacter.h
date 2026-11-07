#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "Core/TurnoTypes.h"
#include "TurnoGhostCharacter.generated.h"

UCLASS()
class ELTURNO0317_API ATurnoGhostCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    ATurnoGhostCharacter();

    UFUNCTION(BlueprintCallable, Category="Turno|Ghost")
    void SetGhostState(ETurnoGhostState NewState);

    UFUNCTION(BlueprintPure, Category="Turno|Ghost")
    ETurnoGhostState GetGhostState() const { return GhostState; }

protected:
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Turno|Ghost")
    ETurnoGhostState GhostState = ETurnoGhostState::Observing;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Turno|Ghost")
    bool bCanBeRepelledByFlashlight = false;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Turno|Ghost")
    float PreferredDistance = 420.0f;
};