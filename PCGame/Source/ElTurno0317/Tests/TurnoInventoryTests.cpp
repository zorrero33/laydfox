#if WITH_DEV_AUTOMATION_TESTS

#include "Misc/AutomationTest.h"
#include "Inventory/TurnoInventoryComponent.h"

IMPLEMENT_SIMPLE_AUTOMATION_TEST(
    FTurnoInventoryUniqueEvidenceTest,
    "ElTurno.Inventory.UniqueEvidence",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter
)

bool FTurnoInventoryUniqueEvidenceTest::RunTest(const FString& Parameters)
{
    UTurnoInventoryComponent* Inventory = NewObject<UTurnoInventoryComponent>();
    TestNotNull(TEXT("Inventory component is created"), Inventory);
    if (!Inventory)
    {
        return false;
    }

    TestTrue(TEXT("First evidence is added"), Inventory->AddEvidence(FName(TEXT("EVIDENCE_317_DRAWING"))));
    TestFalse(TEXT("Duplicate evidence is rejected"), Inventory->AddEvidence(FName(TEXT("EVIDENCE_317_DRAWING"))));
    TestTrue(TEXT("Evidence lookup succeeds"), Inventory->HasEvidence(FName(TEXT("EVIDENCE_317_DRAWING"))));
    TestEqual(TEXT("Inventory stores one unique evidence"), Inventory->GetEvidenceIds().Num(), 1);

    TArray<FName> RestoredIds;
    RestoredIds.Add(FName(TEXT("ARCHIVE_2006")));
    RestoredIds.Add(FName(TEXT("ARCHIVE_2006")));
    RestoredIds.Add(FName(TEXT("ALMA_PHOTO")));
    Inventory->RestoreEvidenceIds(RestoredIds);

    TestEqual(TEXT("Restore removes duplicate IDs"), Inventory->GetEvidenceIds().Num(), 2);
    TestTrue(TEXT("Restored archive evidence exists"), Inventory->HasEvidence(FName(TEXT("ARCHIVE_2006"))));
    return true;
}

#endif // WITH_DEV_AUTOMATION_TESTS
