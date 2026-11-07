#include "Game/TurnoGameMode.h"
#include "Player/TurnoPlayerCharacter.h"

ATurnoGameMode::ATurnoGameMode()
{
    DefaultPawnClass = ATurnoPlayerCharacter::StaticClass();
}