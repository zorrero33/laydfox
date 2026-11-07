#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "TurnoPlayerCharacter.generated.h"

class UCameraComponent;
class USpotLightComponent;
class UTurnoInventoryComponent;

UCLASS()
class ELTURNO0317_API ATurnoPlayerCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    ATurnoPlayerCharacter();

    virtual void Tick(float DeltaSeconds) override;
    virtual void SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) override;

    UFUNCTION(BlueprintCallable, Category="Turno|Flashlight")
    void SetFlashlightBattery(float NewBattery);

    UFUNCTION(BlueprintPure, Category="Turno|Flashlight")
    float GetFlashlightBattery() const { return FlashlightBattery; }

    UFUNCTION(BlueprintPure, Category="Turno|Player")
    UCameraComponent* GetFirstPersonCamera() const { return FirstPersonCamera; }

protected:
    void MoveForward(float Value);
    void MoveRight(float Value);
    void StartSprint();
    void StopSprint();
    void StartCrouch();
    void StopCrouch();
    void ToggleFlashlight();
    void Interact();
    void SaveProgress();
    void LoadProgress();

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Turno|Player")
    TObjectPtr<UCameraComponent> FirstPersonCamera;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Turno|Player")
    TObjectPtr<USpotLightComponent> Flashlight;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Turno|Inventory")
    TObjectPtr<UTurnoInventoryComponent> InventoryComponent;

    UPROPERTY(EditDefaultsOnly, Category="Turno|Player")
    float WalkSpeed = 260.0f;

    UPROPERTY(EditDefaultsOnly, Category="Turno|Player")
    float SprintSpeed = 420.0f;

    UPROPERTY(EditDefaultsOnly, Category="Turno|Interaction")
    float InteractionDistance = 260.0f;

    UPROPERTY(EditDefaultsOnly, Category="Turno|Flashlight")
    float BatteryDrainPerSecond = 0.13f;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Turno|Flashlight")
    float FlashlightBattery = 100.0f;
};