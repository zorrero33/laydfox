#pragma once

#include "CoreMinimal.h"
#include "UObject/Interface.h"
#include "TurnoInteractable.generated.h"

UINTERFACE(BlueprintType)
class UTurnoInteractable : public UInterface
{
    GENERATED_BODY()
};

class ELTURNO0317_API ITurnoInteractable
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category="Turno|Interaction")
    FText GetInteractionPrompt() const;

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category="Turno|Interaction")
    void Interact(AActor* Interactor);
};