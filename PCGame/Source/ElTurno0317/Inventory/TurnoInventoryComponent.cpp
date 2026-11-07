#include "Inventory/TurnoInventoryComponent.h"

UTurnoInventoryComponent::UTurnoInventoryComponent()
{
    PrimaryComponentTick.bCanEverTick = false;
}

bool UTurnoInventoryComponent::AddEvidence(FName EvidenceId)
{
    if (EvidenceId.IsNone() || EvidenceIds.Contains(EvidenceId))
    {
        return false;
    }

    EvidenceIds.Add(EvidenceId);
    return true;
}

bool UTurnoInventoryComponent::HasEvidence(FName EvidenceId) const
{
    return EvidenceIds.Contains(EvidenceId);
}

void UTurnoInventoryComponent::RestoreEvidenceIds(const TArray<FName>& SavedIds)
{
    EvidenceIds.Reset();
    for (const FName Id : SavedIds)
    {
        if (!Id.IsNone())
        {
            EvidenceIds.AddUnique(Id);
        }
    }
}