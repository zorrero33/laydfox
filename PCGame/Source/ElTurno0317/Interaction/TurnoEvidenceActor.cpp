#include "Interaction/TurnoEvidenceActor.h"
#include "Inventory/TurnoInventoryComponent.h"
#include "Components/SceneComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Components/SphereComponent.h"

ATurnoEvidenceActor::ATurnoEvidenceActor()
{
    PrimaryActorTick.bCanEverTick = false;

    SceneRoot = CreateDefaultSubobject<USceneComponent>(TEXT("SceneRoot"));
    SetRootComponent(SceneRoot);

    EvidenceMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("EvidenceMesh"));
    EvidenceMesh->SetupAttachment(SceneRoot);
    EvidenceMesh->SetCollisionEnabled(ECollisionEnabled::QueryOnly);
    EvidenceMesh->SetCollisionResponseToAllChannels(ECR_Ignore);
    EvidenceMesh->SetCollisionResponseToChannel(ECC_Visibility, ECR_Block);

    InteractionCollision = CreateDefaultSubobject<USphereComponent>(TEXT("InteractionCollision"));
    InteractionCollision->SetupAttachment(SceneRoot);
    InteractionCollision->InitSphereRadius(85.0f);
    InteractionCollision->SetCollisionEnabled(ECollisionEnabled::QueryOnly);
    InteractionCollision->SetCollisionResponseToAllChannels(ECR_Ignore);
}

FText ATurnoEvidenceActor::GetInteractionPrompt_Implementation() const
{
    return DisplayName.IsEmpty()
        ? NSLOCTEXT("Turno", "InspectEvidence", "Examinar prueba")
        : FText::Format(NSLOCTEXT("Turno", "InspectNamedEvidence", "Examinar: {0}"), DisplayName);
}

void ATurnoEvidenceActor::Interact_Implementation(AActor* Interactor)
{
    if (!IsValid(Interactor) || EvidenceId.IsNone())
    {
        return;
    }

    UTurnoInventoryComponent* Inventory = Interactor->FindComponentByClass<UTurnoInventoryComponent>();
    if (!Inventory || !Inventory->AddEvidence(EvidenceId))
    {
        return;
    }

    SetActorEnableCollision(false);
    SetActorHiddenInGame(true);
}