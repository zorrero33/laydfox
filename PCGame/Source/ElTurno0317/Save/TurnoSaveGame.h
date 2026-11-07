#pragma once

#include "CoreMinimal.h"
#include "GameFramework/SaveGame.h"
#include "Core/TurnoTypes.h"
#include "TurnoSaveGame.generated.h"

UCLASS()
class ELTURNO0317_API UTurnoSaveGame : public USaveGame
{
    GENERATED_BODY()

public:
    UPROPERTY(SaveGame, VisibleAnywhere, Category="Turno|Save")
    ETurnoChapter CurrentChapter = ETurnoChapter::Contract;

    UPROPERTY(SaveGame, VisibleAnywhere, Category="Turno|Save")
    TArray<FName> EvidenceIds;

    UPROPERTY(SaveGame, VisibleAnywhere, Category="Turno|Save")
    TArray<FName> StoryFlags;

    UPROPERTY(SaveGame, VisibleAnywhere, Category="Turno|Save")
    FTransform PlayerTransform = FTransform::Identity;

    UPROPERTY(SaveGame, VisibleAnywhere, Category="Turno|Save")
    float FlashlightBattery = 100.0f;

    UPROPERTY(SaveGame, VisibleAnywhere, Category="Turno|Save")
    FName CheckpointId = NAME_None;
};