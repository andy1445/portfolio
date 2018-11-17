class Tree {
    constructor(center = null, length = null, thickness = null, theta = null, color = "#4E90EC") {
        this.center = center;
        this.length = length;
        this.thickness = thickness;
        this.theta = theta;
        this.color = color;
        this.trunk_length = Math.round((Math.random() * (.5 - .3) + .5) * length);
        this.screen = document.getElementById("myCanvas").getContext("2d");
    }

    randInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    //returns randomized koch curve
    random_koch(left, right, displacement, roughness, array) {
        if ((left + 1) == right) {
            return;
        }
        var mid = Math.floor((left + right) / 2);
        var change = ((Math.random() * 2) - 1) * displacement;
        array[mid] = ((array[left] + array[right]) / 2 + change);
        displacement = displacement * roughness

        this.random_koch(left, mid, displacement, roughness, array);
        this.random_koch(mid, right, displacement, roughness, array);
    }

    draw_lines(array, screen, point1, point2) {
        //solve line equation
        var unit_vector;
        if (point1.x == point2.x) //vertical line
            unit_vector = { x: 1, y: 0 };
        else {
            var m = (point1.y - point2.y) / (point1.x - point2.x);
            var b = (point1.y - (m * point1.x))
            if (m == 0) //horizontal line
                unit_vector = { x: 0, y: 1 };
            else { //avoid divide by zero 
                //solve for perpendicular line equation
                var pm = -1 / m;
                var pb = point1.y - (pm * point1.x);
                //find another point on perpendicular line
                var x2 = 2;
                var y2 = (pm * x2) + pb;
                //find the unit vector
                var vector = { x: point1.x - x2, y: point1.y - y2 };
                var vector_length = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
                var unit_vector = { x: vector.x / vector_length, y: vector.y / vector_length };
            }
        }

        //draw line between two points
        var length;
        if (point1.x == point2.x || m == 0) //vert or hor
            length = Math.sqrt(Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y), 2));
        else
            length = Math.abs(point2.x - point1.x);

        var increment = length / array.length;
        var point_arr = new Array();
        for (var i = 0; i < array.length; i++)
            point_arr.push({ x: 0, y: 0 });

        var x, y, x2, y2;
        for (i = 0; i < array.length - 1; i++) {
            if (point1.x == point2.x) { //vertical
                if (point1.y > point2.y) { //point 1 is lower
                    x = point1.x;
                    y = (i * increment) + point2.y;
                    x2 = point2.x;
                    y2 = (i + 1) * increment + point2.y;
                } else {
                    x = point1.x;
                    y = (i * increment) + point1.y;
                    x2 = point2.x;
                    y2 = (i + 1) * increment + point1.y;
                }
            } else {
                if (point1.x < point2.x) {
                    x = (i * increment) + point1.x;
                    y = (m * x) + b;
                    x2 = (i + 1) * increment + point1.x;
                    y2 = m * x2 + b;
                } else {
                    x = -((i * increment) - point1.x);
                    y = ((m * x) + b);
                    x2 = -((i + 1) * increment - point1.x);
                    y2 = (m * x2 + b);
                }
            }

            //the array is the displacement perpendicular from the line
            var scaled_v = { x: unit_vector.x * array[i], y: unit_vector.y * array[i] };
            var scaled_v2 = { x: unit_vector.x * array[i + 1], y: unit_vector.y * array[i + 1] };
            var xn = x + scaled_v.x;
            var yn = y + scaled_v.y;
            var xn2 = x2 + scaled_v2.x;
            var yn2 = y2 + scaled_v2.y;

            point_arr[i].x = xn;
            point_arr[i].y = yn;
            point_arr[i + 1].x = xn2;
            point_arr[i + 1].y = yn2;

            this.drawline(screen, { x: xn, y: yn }, { x: xn2, y: yn2 });
        }
        return (point_arr);
    }

    drawline(ctx, p1, p2) {
        ctx = document.getElementById("myCanvas").getContext("2d");
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    };

    draw_flower(center, length, angle) {
        let ctx = this.screen;
        ctx.fillStyle = this.color;
        // for (var i = 0; i < 3; i++)
        ctx.fillRect(center.x, center.y, Math.random(), Math.random());

        // var ll = length / 2;
        // var sl = length / 8;
        // var part1 = new Array();
        // var part2 = new Array();
        // // hardcode flower shape
        // part1.push({ x: center.x + ll * Math.cos(angle), y: center.y + ll * Math.sin(angle) });
        // part1.push({ x: center.x + sl * Math.cos(angle + Math.PI / 2), y: center.y + sl * Math.sin(angle + Math.PI / 2) });
        // part1.push({ x: center.x + ll * Math.cos(angle + Math.PI), y: center.y + ll * Math.sin(angle + Math.PI) });
        // part1.push({ x: center.x + sl * Math.cos(angle + Math.PI * 3 / 2), y: center.y + sl * Math.sin(angle + Math.PI * 3 / 2) });
        // part2.push({ x: center.x + sl * Math.cos(angle), y: center.y + sl * Math.sin(angle) });
        // part2.push({ x: center.x + ll * Math.cos(angle + Math.PI / 2), y: center.y + ll * Math.sin(angle + Math.PI / 2) });
        // part2.push({ x: center.x + sl * Math.cos(angle + Math.PI), y: center.y + sl * Math.sin(angle + Math.PI) });
        // part2.push({ x: center.x + ll * Math.cos(angle + Math.PI * 3 / 2), y: center.y + ll * Math.sin(angle + Math.PI * 3 / 2) });

        // for (var i = 0; i < 3; i++) {
        //     this.drawline(this.screen, part1[i], part1[i + 1], 1);
        //     this.drawline(this.screen, part2[i], part2[i + 1], 1);
        // }
    }

    //the start theta defines the current planes rotation
    random_flower(center, olength, thickness, start_theta) {
        thickness = thickness * 0.8;
        var num_branch = this.randInt(0, 5);
        var interval;
        if (num_branch > 0)
            interval = olength / (num_branch);
        else
            interval = 0;
        var spot = interval;

        //make the top branch off many times
        for (var i = 0; i < this.randInt(1, 3); i++) {
            var theta = (this.randInt(50, 100) / 100) * (Math.PI / 4);
            if (olength > 2) { //stop branching
                var length = olength * this.randInt(50, 70) / 100;
                var random_bin = this.randInt(0, 2);
                var new_theta;
                if (random_bin == 1)
                    new_theta = start_theta - theta;
                else
                    new_theta = start_theta + theta;

                //draw branch
                var new_point = { x: center.x + (length * Math.cos(new_theta)), y: center.y - (length * Math.sin(new_theta)) };
                if (length > 30) {
                    var array = new Array(31).join('0').split('').map(parseFloat);
                    this.random_koch(0, 29, 5, 0.5, array);
                    this.draw_lines(array, this.screen, center, new_point, thickness);
                }
                else {
                    this.drawline(this.screen, center, new_point);
                }

                //continue branch left and right
                this.random_flower(new_point, length, thickness, new_theta);
            }
        }

        for (var i = 0; i < num_branch - 1; i++) { //randomize the number of branches 
            theta = this.randInt(50, 100) / 100 * Math.PI / 4;
            if (olength < 2) { //stop branching, flower
                this.draw_flower(center, 4, theta);
            }
            else {
                var current_center = { x: center.x - (spot * Math.cos(start_theta)), y: center.y + (spot * Math.sin(start_theta)) };
                spot = spot + interval;
                length = olength * this.randInt(50, 70) / 100;
                random_bin = this.randInt(0, 2);
                if (random_bin == 1)
                    new_theta = start_theta - theta;
                else
                    new_theta = start_theta + theta;

                //draw branch
                new_point = { x: current_center.x + length * Math.cos(new_theta), y: current_center.y - length * Math.sin(new_theta) };
                if (length > 30) {
                    var array = new Array(31).join('0').split('').map(parseFloat);
                    this.random_koch(0, 29, 5, 0.5, array);
                    this.draw_lines(array, this.screen, current_center, new_point, thickness)
                } else {
                    this.drawline(this.screen, current_center, new_point);
                }

                //continue branch left and right
                this.random_flower(new_point, length, thickness, new_theta);
            }
        }
    }

    draw_tree() {
        var two_variation = (Math.floor((Math.random() * 50)) + 70) / 100 * 2;
        var branch_trunk = this.trunk_length / two_variation; //branches along top half of trunk
        var branchless_trunk = this.trunk_length - branch_trunk;
        var num_branch = this.randInt(1, 2);
        var increment = branch_trunk / num_branch; //place branches along trunk on this increment
        var percent;
        var placement;
        var branch_center;

        for (var i = 0; i < num_branch; i++) {
            //50% to 100% of placement
            percent = this.randInt(50, 100) / 100;
            placement = branchless_trunk + (increment * i * percent);
            //place random branching along spot on trunk
            branch_center = { x: this.center.x, y: this.center.y - placement };
            this.random_flower(branch_center, placement * 0.7, 2, (Math.PI / 2));
        }

        //top of the tree
        var new_center = { x: this.center.x, y: this.center.y - this.trunk_length };

        //draw a rickety trunk
        var array = new Array(31).join('0').split('').map(parseFloat);
        this.random_koch(0, 29, 5, 0.5, array);
        this.draw_lines(array, this.screen, this.center, new_center, this.thickness);
        this.random_flower(new_center, branch_trunk, this.thickness, (Math.PI / 2));
    }
}

$(document).ready(function () {
    onload();

    $(".reload").click(function(){
        onload();
    });
    function onload() {
        var color = "#" + Math.random().toString(16).slice(2, 8);
        canvas = document.getElementById("myCanvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // draw trees
        let totTrees = 3;
        for (let i = 0; i < totTrees; i++) {
            new Tree({ x: Math.random() * canvas.width, y: canvas.height }, 550, 2, Math.PI / 6, color).draw_tree();
        }

        // draw the ground 
        var array = new Array(51).join('0').split('').map(parseFloat);
        new Tree().random_koch(0, 49, 50, 0.75, array);
        ctx = document.getElementById("myCanvas").getContext("2d");
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 30);
        var x_inc = canvas.width / array.length;
        for (var i = 0; i < array.length; i++) {
            ctx.lineTo(x_inc * i, canvas.height - Math.abs(array[i]) - 30)
        }
        // complete the square
        ctx.fillStyle = color;
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.lineTo(0, canvas.height - 30);
        ctx.closePath();
        ctx.fill();
    }
});