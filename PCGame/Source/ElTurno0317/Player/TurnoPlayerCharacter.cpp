#include "Player/TurnoPlayerCharacter.h"
#include "Camera/CameraComponent.h"
#include "Components/SpotLightComponent.h"
#include "Components/CapsuleComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Inventory/TurnoInventoryComponent.h"
#include "Interaction/TurnoInteractable.h"
#include "DrawDebugHelpers.h"
#include "Engine/World.h"

ATurnoPlayerCharacter::ATurnoPlayerCharacter()
{
    PrimaryActorTick.bCanEverTick = true;
    bUseControllerRotationYaw = true;

    GetCharacterMovement()->MaxWalkSpeed = WalkSpeed;
    GetCharacterMovement()->MaxWalkSpeedCrouched = 145.0f;
    GetCharacterMovement()->bCanCrouch = true;
    GetCharacterMovement()->bOrientRotationToMovement = false;

    FirstPersonCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
    FirstPersonCamera->SetupAttachment(GetCapsuleComponent());
    FirstPersonCamera->SetRelativeLocation(FVector(0.0f, 0.0f, 64.0f));
    FirstPersonCamera->bUsePawnControlRotation = true;

    Flashlight = CreateDefaultSubobject<USpotLightComponent>(TEXT("Flashlight"));
    Flashlight->SetupAttachment(FirstPersonCamera);
    Flashlight->SetRelativeLocation(FVector(12.0f, 0.0f, -4.0f));
    Flashlight->InnerConeAngle = 14.0f;
    Flashlight->OuterConeAngle = 34.0f;
    Flashlight->AttenuationRadius = 1450.0f;
    Flashlight->Intensity = 8500.0f;
    Flashlight->SetVisibility(false);

    InventoryComponent = CreateDefaultSubobject<UTurnoInventoryComponent>(TEXT("InventoryComponent"));
}

void ATurnoPlayerCharacter::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);

    if (Flashlight->IsVisible() && FlashlightBattery > 0.0f)
    {
        SetFlashlightBattery(FlashlightBattery - BatteryDrainPerSecond * DeltaSeconds);
        if (FlashlightBattery <= 0.0f)
        {
            Flashlight->SetVisibility(false);
        }
    }
}

void ATurnoPlayerCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);

    check(PlayerInputComponent);
    PlayerInputComponent->BindAxis(TEXT("MoveForward"), this, &ATurnoPlayerCharacter::MoveForward);
    PlayerInputComponent->BindAxis(TEXT("MoveRight"), this, &ATurnoPlayerCharacter::MoveRight);
    PlayerInputComponent->BindAxis(TEXT("Turn"), this, &APawn::AddControllerYawInput);
    PlayerInputComponent->BindAxis(TEXT("LookUp"), this, &APawn::AddControllerPitchInput);

    PlayerInputComponent->BindAction(TEXT("Sprint"), IE_Pressed, this, &ATurnoPlayerCharacter::StartSprint);
    PlayerInputComponent->BindAction(TEXT("Sprint"), IE_Released, this, &ATurnoPlayerCharacter::StopSprint);
    PlayerInputComponent->BindAction(TEXT("Crouch"), IE_Pressed, this, &ATurnoPlayerCharacter::StartCrouch);
    PlayerInputComponent->BindAction(TEXT("Crouch"), IE_Released, this, &ATurnoPlayerCharacter::StopCrouch);
    PlayerInputComponent->BindAction(TEXT("Flashlight"), IE_Pressed, this, &ATurnoPlayerCharacter::ToggleFlashlight);
    PlayerInputComponent->BindAction(TEXT("Interact"), IE_Pressed, this, &ATurnoPlayerCharacter::Interact);
}

void ATurnoPlayerCharacter::MoveForward(float Value)
{
    if (Controller && !FMath::IsNearlyZero(Value))
    {
        AddMovementInput(GetActorForwardVector(), Value);
    }
}

void ATurnoPlayerCharacter::MoveRight(float Value)
{
    if (Controller && !FMath::IsNearlyZero(Value))
    {
        AddMovementInput(GetActorRightVector(), Value);
    }
}

void ATurnoPlayerCharacter::StartSprint()
{
    GetCharacterMovement()->MaxWalkSpeed = SprintSpeed;
}

void ATurnoPlayerCharacter::StopSprint()
{
    GetCharacterMovement()->MaxWalkSpeed = WalkSpeed;
}

void ATurnoPlayerCharacter::StartCrouch()
{
    Crouch();
}

void ATurnoPlayerCharacter::StopCrouch()
{
    UnCrouch();
}

void ATurnoPlayerCharacter::ToggleFlashlight()
{
    if (FlashlightBattery <= 0.0f)
    {
        Flashlight->SetVisibility(false);
        return;
    }

    Flashlight->ToggleVisibility();
}

void ATurnoPlayerCharacter::Interact()
{
    if (!FirstPersonCamera)
    {
        return;
    }

    const FVector Start = FirstPersonCamera->GetComponentLocation();
    const FVector End = Start + FirstPersonCamera->GetForwardVector() * InteractionDistance;

    FHitResult Hit;
    FCollisionQueryParams Params(SCENE_QUERY_STAT(TurnoInteraction), true, this);
    if (!GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility, Params))
    {
        return;
    }

    AActor* HitActor = Hit.GetActor();
    if (IsValid(HitActor) && HitActor->GetClass()->ImplementsInterface(UTurnoInteractable::StaticClass()))
    {
        ITurnoInteractable::Execute_Interact(HitActor, this);
    }
}

void ATurnoPlayerCharacter::SetFlashlightBattery(float NewBattery)
{
    FlashlightBattery = FMath::Clamp(NewBattery, 0.0f, 100.0f);
}