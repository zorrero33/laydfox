#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "Core/TurnoTypes.h"
#include "TurnoStorySubsystem.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FTurnoChapterChanged, ETurnoChapter, PreviousChapter, ETurnoChapter, NewChapter);

UCLASS()
class ELTURNO0317_API UTurnoStorySubsystem : public UWorldSubsystem
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintCallable, Category="Turno|Story")
    void SetChapter(ETurnoChapter NewChapter);

    UFUNCTION(BlueprintPure, Category="Turno|Story")
    ETurnoChapter GetCurrentChapter() const { return CurrentChapter; }

    UFUNCTION(BlueprintCallable, Category="Turno|Story")
    bool AddStoryFlag(FName FlagId);

    UFUNCTION(BlueprintPure, Category="Turno|Story")
    bool HasStoryFlag(FName FlagId) const;

    UFUNCTION(BlueprintCallable, Category="Turno|Save")
    bool SaveGame(AActor* Player, FName SlotName = TEXT("TurnoAutoSave"));

    UFUNCTION(BlueprintCallable, Category="Turno|Save")
    bool LoadGame(AActor* Player, FName SlotName = TEXT("TurnoAutoSave"));

    UPROPERTY(BlueprintAssignable, Category="Turno|Story")
    FTurnoChapterChanged OnChapterChanged;

private:
    UPROPERTY(VisibleAnywhere, Category="Turno|Story")
    ETurnoChapter CurrentChapter = ETurnoChapter::Contract;

    UPROPERTY(VisibleAnywhere, Category="Turno|Story")
    TArray<FName> StoryFlags;
};