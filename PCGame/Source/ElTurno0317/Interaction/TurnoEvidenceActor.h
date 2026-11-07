#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Interaction/TurnoInteractable.h"
#include "TurnoEvidenceActor.generated.h"

class USceneComponent;
class UStaticMeshComponent;
class USphereComponent;

UCLASS()
class ELTURNO0317_API ATurnoEvidenceActor : public AActor, public ITurnoInteractable
{
    GENERATED_BODY()

public:
    ATurnoEvidenceActor();

    virtual FText GetInteractionPrompt_Implementation() const override;
    virtual void Interact_Implementation(AActor* Interactor) override;

protected:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Turno|Evidence")
    TObjectPtr<USceneComponent> SceneRoot;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Turno|Evidence")
    TObjectPtr<UStaticMeshComponent> EvidenceMesh;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Turno|Evidence")
    TObjectPtr<USphereComponent> InteractionCollision;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Turno|Evidence")
    FName EvidenceId = NAME_None;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Turno|Evidence")
    FText DisplayName;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Turno|Evidence", meta=(MultiLine=true))
    FText EvidenceText;
};