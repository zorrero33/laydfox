#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "TurnoInventoryComponent.generated.h"

UCLASS(ClassGroup=(Turno), meta=(BlueprintSpawnableComponent))
class ELTURNO0317_API UTurnoInventoryComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    UTurnoInventoryComponent();

    UFUNCTION(BlueprintCallable, Category="Turno|Inventory")
    bool AddEvidence(FName EvidenceId);

    UFUNCTION(BlueprintCallable, Category="Turno|Inventory")
    bool HasEvidence(FName EvidenceId) const;

    UFUNCTION(BlueprintCallable, Category="Turno|Inventory")
    void RestoreEvidenceIds(const TArray<FName>& SavedIds);

    UFUNCTION(BlueprintPure, Category="Turno|Inventory")
    const TArray<FName>& GetEvidenceIds() const { return EvidenceIds; }

private:
    UPROPERTY(VisibleAnywhere, SaveGame, Category="Turno|Inventory")
    TArray<FName> EvidenceIds;
};