using UnrealBuildTool;
using System.Collections.Generic;

public class ElTurno0317EditorTarget : TargetRules
{
    public ElTurno0317EditorTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Editor;
        DefaultBuildSettings = BuildSettingsVersion.V5;
        ExtraModuleNames.Add("ElTurno0317");
    }
}