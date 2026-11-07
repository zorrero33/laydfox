#include "Systems/TurnoStorySubsystem.h"
#include "Save/TurnoSaveGame.h"
#include "Inventory/TurnoInventoryComponent.h"
#include "Player/TurnoPlayerCharacter.h"
#include "Kismet/GameplayStatics.h"

void UTurnoStorySubsystem::SetChapter(ETurnoChapter NewChapter)
{
    if (CurrentChapter == NewChapter)
    {
        return;
    }

    const ETurnoChapter Previous = CurrentChapter;
    CurrentChapter = NewChapter;
    OnChapterChanged.Broadcast(Previous, NewChapter);
}

bool UTurnoStorySubsystem::AddStoryFlag(FName FlagId)
{
    if (FlagId.IsNone() || StoryFlags.Contains(FlagId))
    {
        return false;
    }

    StoryFlags.Add(FlagId);
    return true;
}

bool UTurnoStorySubsystem::HasStoryFlag(FName FlagId) const
{
    return StoryFlags.Contains(FlagId);
}

bool UTurnoStorySubsystem::SaveGame(AActor* Player, FName SlotName)
{
    if (!IsValid(Player))
    {
        return false;
    }

    if (SlotName.IsNone())
    {
        SlotName = FName(TEXT("TurnoAutoSave"));
    }

    UTurnoSaveGame* SaveObject = Cast<UTurnoSaveGame>(
        UGameplayStatics::CreateSaveGameObject(UTurnoSaveGame::StaticClass()));

    if (!SaveObject)
    {
        return false;
    }

    SaveObject->CurrentChapter = CurrentChapter;
    SaveObject->StoryFlags = StoryFlags;
    SaveObject->PlayerTransform = Player->GetActorTransform();

    if (const UTurnoInventoryComponent* Inventory = Player->FindComponentByClass<UTurnoInventoryComponent>())
    {
        SaveObject->EvidenceIds = Inventory->GetEvidenceIds();
    }

    if (const ATurnoPlayerCharacter* TurnoPlayer = Cast<ATurnoPlayerCharacter>(Player))
    {
        SaveObject->FlashlightBattery = TurnoPlayer->GetFlashlightBattery();
    }

    return UGameplayStatics::SaveGameToSlot(SaveObject, SlotName.ToString(), 0);
}

bool UTurnoStorySubsystem::LoadGame(AActor* Player, FName SlotName)
{
    if (!IsValid(Player))
    {
        return false;
    }

    if (SlotName.IsNone())
    {
        SlotName = FName(TEXT("TurnoAutoSave"));
    }

    if (!UGameplayStatics::DoesSaveGameExist(SlotName.ToString(), 0))
    {
        return false;
    }

    UTurnoSaveGame* SaveObject = Cast<UTurnoSaveGame>(
        UGameplayStatics::LoadGameFromSlot(SlotName.ToString(), 0));

    if (!SaveObject)
    {
        return false;
    }

    SetChapter(SaveObject->CurrentChapter);
    StoryFlags = SaveObject->StoryFlags;
    Player->SetActorTransform(SaveObject->PlayerTransform);

    if (UTurnoInventoryComponent* Inventory = Player->FindComponentByClass<UTurnoInventoryComponent>())
    {
        Inventory->RestoreEvidenceIds(SaveObject->EvidenceIds);
    }

    if (ATurnoPlayerCharacter* TurnoPlayer = Cast<ATurnoPlayerCharacter>(Player))
    {
        TurnoPlayer->SetFlashlightBattery(SaveObject->FlashlightBattery);
    }

    return true;
}