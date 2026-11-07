using UnrealBuildTool;
using System.Collections.Generic;

public class ElTurno0317Target : TargetRules
{
    public ElTurno0317Target(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Game;
        DefaultBuildSettings = BuildSettingsVersion.V5;
        ExtraModuleNames.Add("ElTurno0317");
    }
}