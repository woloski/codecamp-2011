namespace Microsoft.Samples.SocialGames.WorkerNodeJs
{
    using System;
    using System.Diagnostics;
    using System.Net.Sockets;
    using System.Security.Permissions;
    using System.Threading;
    using Microsoft.WindowsAzure.ServiceRuntime;

    public class WorkerRole : RoleEntryPoint
    {
        private Process proc;

        [SecurityPermission(SecurityAction.LinkDemand, Flags = SecurityPermissionFlag.UnmanagedCode)]
        public override void Run()
        {
            this.proc.WaitForExit();
        }

        [SecurityPermission(SecurityAction.LinkDemand, Flags = SecurityPermissionFlag.UnmanagedCode)]
        public override bool OnStart()
        {
            Trace.TraceInformation("Microsoft.Samples.SocialGames.WorkerNodeJs.OnStart");
            this.LaunchNode();
            return base.OnStart();
        }

        private bool NodeIsOk()
        {
            return true;
        }

        private Process LaunchNode()
        {
            Trace.TraceInformation("Launching Node.Js server");
            this.proc = new Process()
            {
                StartInfo = new ProcessStartInfo(
                    Environment.ExpandEnvironmentVariables(@"%RoleRoot%\approot\node.exe"),
                    "gameserver.js --debug")
                {
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    WorkingDirectory = Environment.ExpandEnvironmentVariables(@"%RoleRoot%\approot\"),
                }
            };
            this.proc.Start();

            return this.proc;
        }
    }
}
