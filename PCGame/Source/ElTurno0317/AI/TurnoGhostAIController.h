#pragma once

#include "CoreMinimal.h"
#include "AIController.h"
#include "TurnoGhostAIController.generated.h"

class UAIPerceptionComponent;
class UAISenseConfig_Sight;
class UAISenseConfig_Hearing;
struct FAIStimulus;

UCLASS()
class ELTURNO0317_API ATurnoGhostAIController : public AAIController
{
    GENERATED_BODY()

public:
    ATurnoGhostAIController();

protected:
    UFUNCTION()
    void HandleTargetPerceptionUpdated(AActor* Actor, FAIStimulus Stimulus);

    UPROPERTY(VisibleAnywhere, Category="Turno|AI")
    TObjectPtr<UAIPerceptionComponent> Perception;

    UPROPERTY()
    TObjectPtr<UAISenseConfig_Sight> SightConfig;

    UPROPERTY()
    TObjectPtr<UAISenseConfig_Hearing> HearingConfig;

    UPROPERTY(EditDefaultsOnly, Category="Turno|AI")
    float StopDistance = 135.0f;

    TWeakObjectPtr<AActor> CurrentTarget;
    FVector LastKnownLocation = FVector::ZeroVector;
};