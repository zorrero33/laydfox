#include "AI/TurnoGhostAIController.h"
#include "Perception/AIPerceptionComponent.h"
#include "Perception/AISenseConfig_Sight.h"
#include "Perception/AISenseConfig_Hearing.h"
#include "Perception/AIPerceptionTypes.h"

ATurnoGhostAIController::ATurnoGhostAIController()
{
    Perception = CreateDefaultSubobject<UAIPerceptionComponent>(TEXT("Perception"));
    SetPerceptionComponent(*Perception);

    SightConfig = CreateDefaultSubobject<UAISenseConfig_Sight>(TEXT("SightConfig"));
    SightConfig->SightRadius = 1350.0f;
    SightConfig->LoseSightRadius = 1650.0f;
    SightConfig->PeripheralVisionAngleDegrees = 72.0f;
    SightConfig->SetMaxAge(4.5f);
    SightConfig->DetectionByAffiliation.bDetectEnemies = true;
    SightConfig->DetectionByAffiliation.bDetectNeutrals = true;
    SightConfig->DetectionByAffiliation.bDetectFriendlies = true;

    HearingConfig = CreateDefaultSubobject<UAISenseConfig_Hearing>(TEXT("HearingConfig"));
    HearingConfig->HearingRange = 950.0f;
    HearingConfig->LoSHearingRange = 1200.0f;
    HearingConfig->bUseLoSHearing = true;
    HearingConfig->SetMaxAge(5.0f);

    Perception->ConfigureSense(*SightConfig);
    Perception->ConfigureSense(*HearingConfig);
    Perception->SetDominantSense(SightConfig->GetSenseImplementation());
    Perception->OnTargetPerceptionUpdated.AddDynamic(this, &ATurnoGhostAIController::HandleTargetPerceptionUpdated);
}

void ATurnoGhostAIController::HandleTargetPerceptionUpdated(AActor* Actor, FAIStimulus Stimulus)
{
    if (!IsValid(Actor))
    {
        return;
    }

    if (Stimulus.WasSuccessfullySensed())
    {
        CurrentTarget = Actor;
        LastKnownLocation = Actor->GetActorLocation();
        SetFocus(Actor);
        MoveToActor(Actor, StopDistance);
        return;
    }

    if (CurrentTarget.Get() == Actor)
    {
        LastKnownLocation = Stimulus.StimulusLocation;
        CurrentTarget.Reset();
        ClearFocus(EAIFocusPriority::Gameplay);
        MoveToLocation(LastKnownLocation, StopDistance);
    }
}