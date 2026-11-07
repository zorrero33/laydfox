#pragma once

#include "CoreMinimal.h"
#include "TurnoTypes.generated.h"

UENUM(BlueprintType)
enum class ETurnoChapter : uint8
{
    Contract UMETA(DisplayName="El contrato"),
    ClosedWing UMETA(DisplayName="La planta cerrada"),
    Room317 UMETA(DisplayName="Habitación 317"),
    EmptyPediatrics UMETA(DisplayName="Pediatría vacía"),
    Archives UMETA(DisplayName="Los archivos"),
    Morgue UMETA(DisplayName="La morgue"),
    SecurityRoom UMETA(DisplayName="Sala de vigilancia"),
    Basement UMETA(DisplayName="El sótano"),
    TimelessNight UMETA(DisplayName="La noche sin reloj"),
    FinalNight UMETA(DisplayName="La última noche")
};

UENUM(BlueprintType)
enum class ETurnoGhostState : uint8
{
    Dormant,
    Observing,
    Curious,
    Appearing,
    Following,
    Warning,
    Helping,
    Misleading,
    Remembering,
    Searching,
    Pursuing,
    Disappearing
};