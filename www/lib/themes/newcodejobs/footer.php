        <div class="clear"></div>

        <footer>
            <p>
                <?php 
                    echo display('<a href="'. path(slug(__("Advertising")), FALSE, FALSE) .'">'. __("Advertising") .'</a> &nbsp;&nbsp;
                        <!--<a href="'. path(slug(__("Legal notice")), FALSE, FALSE) .'">'. __("Legal notice") .'</a>  &nbsp;&nbsp;-->
                        <!--<a href="'. path(slug(__("Terms of Use")), FALSE, FALSE) .'">'. __("Terms of Use") .'</a>  &nbsp;&nbsp;-->
                        <!--<a href="'. path(slug(__("About CodeJobs")), FALSE, FALSE) .'">'. __("About CodeJobs") .'</a> &nbsp;&nbsp;-->
                        <a href="'. path("links", TRUE) .'">'. __("Links") .'</a> &nbsp;&nbsp;
                        <a href="'. path("feedback") .'">'. __("Contact us") .'</a><br />', TRUE, "Spanish");
                    
                    echo __("This site is licensed under a"); ?> 
                    <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank">Creative Commons Attribution 3.0 License</a>. 
                    <?php echo __("Powered by"); ?> <a href="http://www.milkzoft.com" target="_blank">MilkZoft</a>
            </p>
        </footer>

        <?php echo $this->getJs(); ?>

        <?php
            echo display('<script type="text/javascript">
                            var sc_project = 7655788; 
                            var sc_invisible = 1; 
                            var sc_security = "f167f55b"; 
                        </script> 

                        <script type="text/javascript" src="http://www.statcounter.com/counter/counter.js"></script>', 4);
        ?>
    </body>
</html>